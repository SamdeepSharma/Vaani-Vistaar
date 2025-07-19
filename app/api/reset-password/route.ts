import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Since OTP validation is done on a previous page, we can assume it's valid here
    // We just need to check if the user is verified
    if (!user.isVerified) {
      return NextResponse.json({ message: 'User is not verified' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update the user document
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    // Use save with validateBeforeSave option set to false
    await user.save({ validateBeforeSave: false });

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ message: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}