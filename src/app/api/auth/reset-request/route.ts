import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { vercelDb } from '@/utils/vercelDb';
import { hashPassword } from '@/utils/crypto';
import crypto from 'crypto';

// Simple delay helper to align response times
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const settings = await vercelDb.getSettings();
    const credentials = await vercelDb.getCredentials();

    // Verify if email matches admin contact email, admin username, or the official admin gmail
    const isEmailMatch = 
      email.toLowerCase() === settings.email.toLowerCase() || 
      email.toLowerCase() === credentials.username.toLowerCase() ||
      email.toLowerCase() === (settings.from_email || '').toLowerCase() ||
      email.toLowerCase() === 'kadamproductionweb@gmail.com' ||
      email.toLowerCase() === 'kadamproduction123@gmail.com';

    // Recipient email configuration
    const recipientEmail = settings.from_email || settings.email || 'kadamproductionweb@gmail.com';

    // 1. If it is a match, perform OTP generation, hashing, and email dispatch
    if (isEmailMatch) {
      // Generate secure 6-digit OTP using crypto.randomInt
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

      // Save hashed OTP to DB to protect against DB compromise
      credentials.otpCode = hashPassword(otp);
      credentials.otpExpiry = otpExpiry;
      await vercelDb.setCredentials(credentials);

      // Send OTP via SMTP if configured
      const host = settings.smtp_host || 'smtp-relay.brevo.com';
      const port = parseInt(settings.smtp_port || '587', 10);
      const user = settings.smtp_user;
      const pass = settings.smtp_pass;

      if (user && pass) {
        try {
          const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: port === 465,
            auth: { user, pass },
          });

          await transporter.sendMail({
            from: `Kadam Production Admin Security <${recipientEmail}>`,
            to: recipientEmail,
            subject: `🔑 Password Reset OTP: ${otp}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 25px; background-color: #0d0f19; color: #ffffff; border-radius: 16px; max-width: 500px; margin: 0 auto;">
                <h2 style="color: #8b5cf6; margin-top: 0;">Password Reset OTP</h2>
                <p style="font-size: 14px; color: #a1a1aa;">Use the following 6-digit OTP to reset your Kadam Production admin password:</p>
                <div style="background-color: #161926; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); text-align: center; margin: 20px 0;">
                  <span style="font-size: 32px; font-weight: 800; color: #38bdf8; letter-spacing: 6px;">${otp}</span>
                </div>
                <p style="font-size: 12px; color: #71717a;">Valid for 10 minutes.</p>
              </div>
            `,
          });
        } catch (smtpErr) {
          console.error('SMTP email send error:', smtpErr);
        }
      }
    } else {
      // 2. If it is NOT a match, run dummy operations and a simulated delay to match timing
      const dummyOtp = crypto.randomInt(100000, 999999).toString();
      hashPassword(dummyOtp); // Simulate hashing time
      await delay(150); // Simulate SMTP connection check or random network jitter
    }

    // Align timing response to make it identical
    const elapsed = Date.now() - startTime;
    const targetDelay = 800; // Target execution delay of 800ms
    if (elapsed < targetDelay) {
      await delay(targetDelay - elapsed);
    }

    // Identical response for all inputs to eliminate user enumeration
    return NextResponse.json({ 
      success: true, 
      message: 'If the account exists, a 6-digit verification code has been sent to the registered email address.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
