import User from '../models/User';
import dbConnect from '../lib/dbConnect';
import crypto from 'crypto';
import { hashPassword } from '../lib/auth';

export async function getUserByEmail(email: string) {
  try {
    await dbConnect();
    console.log('Finding user by email:', email);
    const user = await User.findOne({ email }).maxTimeMS(5000).exec();
    return user;
  } catch (error) {
    console.error('Error finding user by email:', (error as Error).message);
    throw error;
  }
}

export async function saveResetToken(userId: string, token: string) {
  try {
    await dbConnect();
    const resetToken = {
      token: crypto.createHash('sha256').update(token).digest('hex'),
      expires: Date.now() + 3600000, // Token valid for 1 hour
    };
    await User.findByIdAndUpdate(userId, { resetToken }).maxTimeMS(5000).exec();
    console.log('Reset token saved for userId:', userId);
  } catch (error) {
    console.error('Error saving reset token:', (error as Error).message);
    throw error;
  }
}

export async function getUserByResetToken(token: string) {
  try {
    await dbConnect();
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      'resetToken.token': hashedToken,
      'resetToken.expires': { $gt: Date.now() },
    }).maxTimeMS(5000).exec();
    return user;
  } catch (error) {
    console.error('Error finding user by reset token:', (error as Error).message);
    throw error;
  }
}

export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    await dbConnect();
    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(userId, { password: hashedPassword, resetToken: null }).maxTimeMS(5000).exec();
    console.log('Password updated for userId:', userId);
  } catch (error) {
    console.error('Error updating user password:', (error as Error).message);
    throw error;
  }
}

export async function invalidateResetToken(userId: string) {
  try {
    await dbConnect();
    await User.findByIdAndUpdate(userId, { resetToken: null }).maxTimeMS(5000).exec();
    console.log('Reset token invalidated for userId:', userId);
  } catch (error) {
    console.error('Error invalidating reset token:', (error as Error).message);
    throw error;
  }
}