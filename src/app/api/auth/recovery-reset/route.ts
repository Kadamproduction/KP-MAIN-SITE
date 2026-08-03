import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { hashPassword } from '@/utils/crypto';

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
    const recoveryKey = typeof body.recoveryKey === 'string' ? sanitizeInput(body.recoveryKey) : '';
    const newPassword = typeof body.newPassword === 'string' ? sanitizeInput(body.newPassword) : '';

    if (!recoveryKey || !newPassword) {
      return NextResponse.json({ error: 'Recovery Key and New Password are required.' }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();

    // Support multiple keys (db array recoveryKeys or single fallback list)
    const dbRecoveryKeys: string[] = credentials.recoveryKeys || [
      credentials.recoveryKey || 'KP-777-RESET',
      'KP-KADAM-RECOVER-99',
      'KP-SECURE-ADMIN-77'
    ];

    const isMatch = dbRecoveryKeys.some((k: string) => sanitizeInput(k).toLowerCase() === recoveryKey.toLowerCase());

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid Master Recovery Key.' }, { status: 401 });
    }

    // Update password with scrypt hashing
    credentials.passwordHash = hashPassword(newPassword);
    credentials.otpCode = null;
    credentials.otpExpiry = null;
    credentials.resetToken = null;
    credentials.resetTokenExpiry = null;
    credentials.resetCount = 0;
    credentials.resetPeriodStart = null;
    
    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
