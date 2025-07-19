// src/app/api/check-email/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to database using your existing dbConnect
    await dbConnect();

    // Check if email exists using mongoose directly
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      email: { type: String, unique: true },
      // ... other fields as needed
    }));

    const existingUser = await User.findOne({ email });

    return NextResponse.json({
      success: true,
      isUnique: !existingUser,
      message: existingUser ? 'Email is already registered' : 'Email is available'
    });

  } catch (error) {
    console.error('Error checking email:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error checking email availability' },
      { status: 500 }
    );
  }
}