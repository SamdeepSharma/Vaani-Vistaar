import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]/option";
import dbConnect from '@/lib/dbConnect';
import Feedback from '@/models/Feedback';
import mongoose from 'mongoose';

// Rate limiting implementation for App Router
const rateLimit = {
  tokenCache: new Map<string, [number, number]>(),
  check: async (limit: number, token: string, interval: number) => {
    const tokenCount = rateLimit.tokenCache.get(token) || [0, Date.now()];
    const currentTime = Date.now();
    const timeInterval = currentTime - tokenCount[1];

    if (tokenCount[0] === 0) {
      rateLimit.tokenCache.set(token, [1, currentTime]);
      return true;
    }

    if (timeInterval < interval) {
      if (tokenCount[0] >= limit) {
        return false;
      }
      tokenCount[0] += 1;
      rateLimit.tokenCache.set(token, tokenCount);
    } else {
      rateLimit.tokenCache.set(token, [1, currentTime]);
    }
    return true;
  }
};

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const withinLimit = await rateLimit.check(10, 'FEEDBACK_TOKEN', 60 * 1000);
    if (!withinLimit) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Get the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const {
      rating,
      review,
      fromLanguage,
      toLanguage,
      originalText,
      translatedText,
    } = body;

    // Validate required fields
    if (!rating || !fromLanguage || !toLanguage || !originalText || !translatedText) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get user from database
    const user = await mongoose.model('User').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Create feedback document
    const feedback = new Feedback({
      userId: user._id,
      userEmail: session.user.email,
      rating,
      review,
      fromLanguage,
      toLanguage,
      originalText,
      translatedText,
    });

    await feedback.save();

    return NextResponse.json({
      message: 'Feedback submitted successfully',
      feedback: feedback
    }, { status: 200 });

  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}