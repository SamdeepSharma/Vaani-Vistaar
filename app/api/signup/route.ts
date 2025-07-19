import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail, sendVerificationSMS } from '@/lib/nodemailerotp';
import logger from '@/lib/logger';
import { createTempUser, getTempUser } from '@/lib/tempUserStorage';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Name, email, and password are required.',
      }, { status: 400 });
    }

    const existingVerifiedUser = await UserModel.findOne({
      $or: [{ email }, { name }],
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json({
        success: false,
        message: 'User with this email or username already exists',
      }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour from now

    const tempUserData = {
      name,
      email,
      password: hashedPassword,
      phone: phone && phone.trim() !== '' ? phone.trim() : undefined,
      otp,
      otpExpires: expiryDate,
    };

    const tempUserId = await createTempUser(tempUserData);

    // Try to send verification email
    const emailResponse = await sendVerificationEmail(email, name, otp);
    
    if (!emailResponse.success) {
      logger.warn(`Failed to send verification email to ${email}. Attempting SMS.`);
      
      // If email fails and phone number is provided, try SMS
      if (phone) {
        const smsResponse = await sendVerificationSMS(phone, otp);
        if (!smsResponse.success) {
          logger.error(`Failed to send verification SMS to ${phone}`);
          return NextResponse.json({
            success: false,
            message: 'Failed to send verification. Please try again later.',
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to send verification email and no phone number provided for SMS.',
        }, { status: 500 });
      }
    }

    logger.info(`Verification sent successfully for: ${email}`);
    return NextResponse.json({
      success: true,
      message: 'Verification sent successfully. Please check your email or phone for the OTP.',
      tempUserId,
    }, { status: 200 });
  } catch (error: any) {
    logger.error('Error in signup process:', error);
    return NextResponse.json({
      success: false,
      message: 'Error in signup process: ' + error.message,
    }, { status: 500 });
  }
}