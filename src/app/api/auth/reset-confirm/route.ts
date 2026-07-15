import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';

export async function POST(request: Request) {
  try {
    const { token, newUsername, newPassword } = await request.json();

    if (!token || !newUsername || !newPassword) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();

    if (!credentials.resetToken || credentials.resetToken !== token) {
      return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 });
    }

    const expiry = credentials.resetTokenExpiry || 0;
    if (Date.now() > expiry) {
      return NextResponse.json({ error: 'Reset link has expired (validity is 15 minutes). Please request a new link.' }, { status: 400 });
    }

    // Update credentials
    credentials.username = newUsername;
    credentials.passwordHash = newPassword;
    credentials.resetToken = null;
    credentials.resetTokenExpiry = null;
    // We clear or keep resetCount? Let's reset resetCount back to 0 on successful password reset!
    credentials.resetCount = 0;

    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
