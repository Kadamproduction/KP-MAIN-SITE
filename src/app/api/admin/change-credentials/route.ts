import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { verifyPassword, hashPassword } from '@/utils/crypto';

function sanitizeInput(val: string, type?: 'email' | 'password'): string {
  if (!val) return '';
  let clean = val
    .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, '') // remove zero-width & RTL/LTR control characters
    .replace(/[\r\n\t]/g, '') // remove carriage returns, newlines, tabs
    .trim();

  // Strip prefixes like "username : ", "password : "
  if (type === 'email') {
    clean = clean.replace(/^(username|email|user)\s*:\s*/i, '');
  } else if (type === 'password') {
    clean = clean.replace(/^(password|pass)\s*:\s*/i, '');
  }

  clean = clean.trim();

  // Strip leading and trailing double/single quotes if present
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1);
  }

  // Strip any remaining wide unicode spaces or mathematical spaces from beginning/end
  return clean.replace(/^[\s\u00A0\u2000-\u200F\u2028\u2029\u202F\u205F\u3000\uFEFF]+|[\s\u00A0\u2000-\u200F\u2028\u2029\u202F\u205F\u3000\uFEFF]+$/g, '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body.token;
    const otp = typeof body.otp === 'string' ? sanitizeInput(body.otp, 'email') : '';
    const newUsername = typeof body.newUsername === 'string' ? sanitizeInput(body.newUsername, 'email') : '';
    const newPassword = typeof body.newPassword === 'string' ? sanitizeInput(body.newPassword, 'password') : '';

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
