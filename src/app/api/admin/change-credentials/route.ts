import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';

export async function POST(request: Request) {
  try {
    const { token, recoveryKey, newUsername, newPassword } = await request.json();

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

    if (!recoveryKey || !newUsername || !newPassword) {
      return NextResponse.json({ error: 'Recovery Key, New Username, and New Password are required.' }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();

    // Support multiple keys (db array recoveryKeys or single fallback list)
    const dbRecoveryKeys: string[] = credentials.recoveryKeys || [
      credentials.recoveryKey || 'KP-777-RESET',
      'KP-KADAM-RECOVER-99',
      'KP-SECURE-ADMIN-77'
    ];

    const isMatch = dbRecoveryKeys.some((k: string) => k.trim().toLowerCase() === recoveryKey.trim().toLowerCase());

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid Master Recovery Key.' }, { status: 401 });
    }

    const now = Date.now();
    let count = credentials.resetCount || 0;
    let periodStart = credentials.resetPeriodStart || null;

    // Check if period expired (30 days since first change of the period)
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (periodStart && now >= periodStart + thirtyDaysMs) {
      count = 0;
      periodStart = null;
    }

    if (count >= 3) {
      const resetDate = new Date(periodStart! + thirtyDaysMs);
      return NextResponse.json({ 
        error: `Maximum credential changes (3 per month) reached. Resets on ${resetDate.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}.` 
      }, { status: 400 });
    }

    // Update credentials
    credentials.username = newUsername;
    credentials.passwordHash = newPassword;
    count += 1;
    if (!periodStart) {
      periodStart = now; // First change in the new monthly window
    }
    credentials.resetCount = count;
    credentials.resetPeriodStart = periodStart;

    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ 
      success: true, 
      resetCount: count, 
      resetPeriodStart: periodStart 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
