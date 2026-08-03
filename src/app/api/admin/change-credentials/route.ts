import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { verifyPassword, hashPassword } from '@/utils/crypto';

function sanitizeInput(val: string): string {
  if (!val) return '';
  return val
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width spaces
    .replace(/[\r\n\t]/g, '') // remove carriage returns, newlines, tabs
    .trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body.token;
    const otp = typeof body.otp === 'string' ? sanitizeInput(body.otp) : '';
    const newUsername = typeof body.newUsername === 'string' ? sanitizeInput(body.newUsername) : '';
    const newPassword = typeof body.newPassword === 'string' ? sanitizeInput(body.newPassword) : '';

    if (!token) {
      return NextResponse.json({ error: 'Token missing.' }, { status: 401 });
    }

    // 1. Verify token
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (Date.now() > payload.exp) {
        return NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid session token.' }, { status: 401 });
    }

    if (!otp || !newUsername || !newPassword) {
      return NextResponse.json({ error: 'OTP, New Username, and New Password are required.' }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();

    // Verify OTP
    if (!credentials.otpCode || !credentials.otpExpiry) {
      return NextResponse.json({ error: 'No OTP requested. Please click "Send OTP to Email" first.' }, { status: 400 });
    }

    if (Date.now() > credentials.otpExpiry) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new OTP.' }, { status: 400 });
    }

    // Verify hashed OTP code
    const isOtpValid = verifyPassword(otp, credentials.otpCode);
    if (!isOtpValid) {
      return NextResponse.json({ error: 'Invalid 6-Digit OTP code. Please check your email inbox.' }, { status: 401 });
    }

    // Clear OTP after successful use
    credentials.otpCode = null;
    credentials.otpExpiry = null;

    // Update credentials with hashed password
    credentials.username = newUsername;
    credentials.passwordHash = hashPassword(newPassword);
    credentials.resetCount = (credentials.resetCount || 0) + 1;

    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ 
      success: true, 
      resetCount: credentials.resetCount
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
