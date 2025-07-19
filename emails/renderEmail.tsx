// src/app/emails/VerificationEmail.ts

interface VerificationEmailProps {
  name: string;
  otp: string;
}

interface EmailData {
  name: string;
  otp: string;
}

export function generateVerificationEmail({ name, otp }: VerificationEmailProps): string {
  return `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hello ${name},</h2>
        <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
        <h3>${otp}</h3>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    `;
}

export function generateVerificationotp({ name, otp }: EmailData): string {
  return `
    <html>
      <body>
        <h1>Verify Your Account</h1>
        <p>Hello ${name},</p>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 1 hour.</p>
      </body>
    </html>
  `;
}


