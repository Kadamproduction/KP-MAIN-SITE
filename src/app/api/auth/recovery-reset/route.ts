import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { hashPassword } from '@/utils/crypto';

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
    const recoveryKey = typeof body.recoveryKey === 'string' ? sanitizeInput(body.recoveryKey, 'email') : '';
    const newPassword = typeof body.newPassword === 'string' ? sanitizeInput(body.newPassword, 'password') : '';

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

    const isMatch = dbRecoveryKeys.some((k: string) => sanitizeInput(k, 'email').toLowerCase() === recoveryKey.toLowerCase());

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
