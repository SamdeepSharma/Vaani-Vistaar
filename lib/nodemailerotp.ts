import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { generateVerificationEmail } from '../emails/renderEmail';
import logger from './logger';

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

interface ApiResponse {
  success: boolean;
  message: string;
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  otp: string
): Promise<ApiResponse> {
  try {
    const emailHtml = generateVerificationEmail({ name, otp });
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Mystery Message Verification Code',
      html: emailHtml,
    });

    logger.info(`Verification email sent successfully to ${email}: ${info.messageId}`);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (error) {
    logger.error('Error sending verification email:', error);
    return { success: false, message: 'Failed to send verification email.' };
  }
}

export async function sendVerificationSMS(
  phone: string,
  otp: string
): Promise<ApiResponse> {
  try {
    const message = await twilioClient.messages.create({
      body: `Your verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    logger.info(`Verification SMS sent successfully to ${phone}`);
    return { success: true, message: 'Verification SMS sent successfully.' };
  } catch (error) {
    logger.error('Error sending verification SMS:', error);
    return { success: false, message: 'Failed to send verification SMS.' };
  }
}