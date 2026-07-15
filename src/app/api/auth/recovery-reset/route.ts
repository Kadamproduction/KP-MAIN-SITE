import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';

export async function POST(request: Request) {
  try {
    const { recoveryKey, newPassword } = await request.json();

    if (!recoveryKey || !newPassword) {
      return NextResponse.json({ error: 'Recovery Key and New Password are required.' }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();

    const dbRecoveryKey = credentials.recoveryKey || 'KP-777-RESET';

    if (recoveryKey.trim() !== dbRecoveryKey.trim()) {
      return NextResponse.json({ error: 'Invalid Master Recovery Key.' }, { status: 401 });
    }

    // Update password
    credentials.passwordHash = newPassword;
    credentials.resetToken = null;
    credentials.resetTokenExpiry = null;
    credentials.resetCount = 0;
    
    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
