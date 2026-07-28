import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { verifyPassword, hashPassword } from '@/utils/crypto';

export async function POST(request: Request) {
  try {
    const { otp, token, newUsername, newPassword } = await request.json();

    const inputCode = otp || token;
    if (!inputCode || !newUsername || !newPassword) {
      return NextResponse.json({ error: 'Missing 6-digit OTP, new username, or new password.' }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();

    const dbOtp = credentials.otpCode || credentials.resetToken;
    const dbExpiry = credentials.otpExpiry || credentials.resetTokenExpiry || 0;

    if (!dbOtp) {
      return NextResponse.json({ error: 'Invalid or expired OTP code.' }, { status: 400 });
    }

    // Verify hashed OTP code
    const isOtpValid = verifyPassword(inputCode, dbOtp);
    if (!isOtpValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP code.' }, { status: 400 });
    }

    if (Date.now() > dbExpiry) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new OTP.' }, { status: 400 });
    }

    // Hash the new password before storing it
    credentials.username = newUsername;
    credentials.passwordHash = hashPassword(newPassword);
    
    // Invalidate OTP after single-use
    credentials.otpCode = null;
    credentials.otpExpiry = null;
    credentials.resetToken = null;
    credentials.resetTokenExpiry = null;
    credentials.resetCount = 0; // Clear lockout stats
    credentials.resetPeriodStart = null;

    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ success: true, message: 'Admin credentials updated successfully!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
