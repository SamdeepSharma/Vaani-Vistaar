// app/api/forgot-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { sendOTPEmail } from '@/lib/nodemailer';
import dbConnect from '@/lib/dbConnect';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  console.log('Received POST request to /api/forgot-password');
  
  try {
    const { email } = await req.json();

    if (!email || !emailRegex.test(email)) {
      console.log('Invalid email provided');
      return NextResponse.json({ message: 'Please provide a valid email address' }, { status: 400 });
    }

    console.log('Processing forgot password request');

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'No account found with this email address.' }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const result = await sendOTPEmail(email, user.name, otp);

    if (!result.success) {
      console.error('Failed to send OTP email');
      return NextResponse.json({ message: 'Failed to send OTP email. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'An OTP has been sent to your email. Please check your email and enter the OTP on the next page.' }, { status: 200 });

  } catch (error) {
    console.error('Error handling forgot password request:', error);
    return NextResponse.json({ message: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}