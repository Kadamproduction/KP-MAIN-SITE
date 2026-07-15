import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';

export async function POST(request: Request) {
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
      email.toLowerCase() === 'kadamproductionweb@gmail.com' ||
      email.toLowerCase() === 'kadamproduction123@gmail.com';

    if (!isEmailMatch) {
      return NextResponse.json({ error: 'No admin account found with that email address.' }, { status: 404 });
    }

    // Generate secure token & expiry (15 mins)
    const resetToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    // Save token to DB
    credentials.resetToken = resetToken;
    credentials.resetTokenExpiry = resetTokenExpiry;
    credentials.resetCount = 0; // reset counter
    await vercelDb.setCredentials(credentials);

    // Get live request URL origin
    const origin = request.headers.get('origin') || 'https://www.kadamproduction.in';
    const resetLink = `${origin}/admin/reset-password?token=${resetToken}`;

    console.log('--- ADMIN RESET LINK GENERATED ---');
    console.log('Reset Link:', resetLink);

    return NextResponse.json({ 
      success: true, 
      message: 'Reset request processed successfully (SMTP key is removed).'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
