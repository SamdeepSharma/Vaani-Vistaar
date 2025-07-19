import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { getTempUser, deleteTempUser } from '@/lib/tempUserStorage';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.text();
    console.log('Received raw body:', body);
    
    let data;
    try {
      data = JSON.parse(body);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON in request body',
      }, { status: 400 });
    }

    console.log('Parsed body:', data);

    const { tempUserId, otp } = data;
    if (!tempUserId || !otp) {
      console.log('Missing required fields:', { tempUserId, otp });
      return NextResponse.json({
        success: false,
        message: 'TempUserId and OTP are required.',
      }, { status: 400 });
    }

    const tempUser = await getTempUser(tempUserId);

    if (!tempUser) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired signup attempt.',
      }, { status: 400 });
    }

    if (tempUser.otp !== otp) {
      return NextResponse.json({
        success: false,
        message: 'Invalid OTP.',
      }, { status: 400 });
    }

    if (new Date() > tempUser.otpExpires) {
      return NextResponse.json({
        success: false,
        message: 'OTP has expired.',
      }, { status: 400 });
    }

   
    const newUser = new UserModel({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      phone: tempUser.phone,
      isVerified: true,
      isAcceptingMessages: true,
      messages: [],
    });

    await newUser.save();


    await deleteTempUser(tempUserId);

    logger.info(`User verified and registered successfully: ${tempUser.email}`);
    return NextResponse.json({
      success: true,
      message: 'User verified and registered successfully.',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error in OTP verification:', error);
    logger.error('Error in OTP verification:', error);
    return NextResponse.json({
      success: false,
      message: 'Error in OTP verification: ' + error.message,
    }, { status: 500 });
  }
}