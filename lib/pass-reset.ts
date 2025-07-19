import crypto from 'crypto';
import { getUserByEmail, saveOtp, verifyOtp, updateUserPassword, setUserVerified } from './otpservice';
import nodemailer from 'nodemailer'; // Assuming you're using Nodemailer to send emails

function generateOtp(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 6);
}

export async function initiatePasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    const otp = generateOtp();
    await saveOtp(user._id, otp);
    
    
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error initiating password reset:', (error as Error).message);
    return { success: false, message: 'An error occurred while initiating password reset' };
  }
}

export async function verifyOtpAndPrepareReset(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  try {
    const isValid = await verifyOtp(email, otp);
    if (!isValid) {
      return { success: false, message: 'Invalid or expired OTP' };
    }
    
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('Error verifying OTP:', (error as Error).message);
    return { success: false, message: 'An error occurred during verification' };
  }
}

export async function resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    await updateUserPassword(user._id, newPassword);
    await setUserVerified(user._id);
    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('Error resetting password:', (error as Error).message);
    return { success: false, message: 'An error occurred while resetting the password' };
  }
}
