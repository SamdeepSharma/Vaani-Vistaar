// src/lib/nodemailer.ts

import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import { generateVerificationEmail } from '../emails/renderEmail'; 
const transporter: Transporter<SendMailOptions> = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true,  // Enable debug output
  logger: true  
});


interface ApiResponse {
  success: boolean;
  message: string;
}

// Function to send verification emails
export async function sendVerificationEmail(
  email: string,
  name: string,
  otp: string
): Promise<ApiResponse> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailHtml = generateVerificationEmail({ name, otp });

    await transporter.sendMail({
      from: 'Dev Team <anchitmehra2018@gmail.com>', 
      to: email,
      subject: 'Mystery Message Verification Code',
      html: emailHtml.toString(),
    });

    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}


export async function sendOTPEmail(email: string, name: string, otp: string): Promise<{ success: boolean }> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <h1>Password Reset</h1>
        <p>Hello ${name},</p>
        <p>Your OTP for password reset is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false };
  }
}