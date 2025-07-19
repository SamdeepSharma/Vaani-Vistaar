import User from '../models/User';
import dbConnect from './dbConnect';
import crypto from 'crypto';
import { hashPassword } from './auth';

export async function getUserByEmail(email: string) {
  try {
    await dbConnect();
    const user = await User.findOne({ email }).exec();
    return user;
  } catch (error: any) {
    console.error('Error finding user by email:', error.message);
    throw error;
  }
}

export async function saveOtp(userId: string, otp: string) {
  try {
    await dbConnect();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    await User.findByIdAndUpdate(userId, { otp, otpExpires }).exec();
  } catch (error:any) {
    console.error('Error saving OTP:', error.message);
    throw error;
  }
}

export async function verifyOtp(email: string, otp: string): Promise<boolean> {
  try {
    await dbConnect();
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    }).exec();
    
    if (user) {
      // Clear the OTP after successful verification
      await User.findByIdAndUpdate(user._id, { otp: null, otpExpires: null }).exec();
      return true;
    }
    return false;
  } catch (error:any) {
    console.error('Error verifying OTP:', error.message);
    throw error;
  }
}

export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    await dbConnect();
    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(userId, { password: hashedPassword }).exec();
  } catch (error:any) {
    console.error('Error updating user password:', error.message);
    throw error;
  }
}

export async function setUserVerified(userId: string) {
  try {
    await dbConnect();
    await User.findByIdAndUpdate(userId, { isVerified: true }).exec();
  } catch (error:any) {
    console.error('Error setting user verified:', error.message);
    throw error;
  }
}
