// app/api/verify-pass/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    console.log('Received email:', email);
    console.log('Received OTP:', otp);

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    console.log('User found:', user);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    if (user.otpExpires < new Date()) {
      return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
    }

      
    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { otp: null, otpExpires: new Date(0) } },
      { new: true, runValidators: false }
    );

    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ message: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}