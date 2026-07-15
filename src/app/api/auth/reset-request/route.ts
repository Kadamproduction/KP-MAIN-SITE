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

    // Enforce 3-resets limit check
    const currentResetCount = credentials.resetCount || 0;
    if (currentResetCount >= 3) {
      return NextResponse.json({ 
        error: 'Maximum password reset limit (3 attempts) has been reached. Please contact support or clear limits inside the Settings panel.' 
      }, { status: 400 });
    }

    // Generate secure token & expiry (15 mins)
    const resetToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    // Save token to DB
    credentials.resetToken = resetToken;
    credentials.resetTokenExpiry = resetTokenExpiry;
    credentials.resetCount = currentResetCount + 1;
    await vercelDb.setCredentials(credentials);

    // Get live request URL origin
    const origin = request.headers.get('origin') || 'https://www.kadamproduction.in';
    const resetLink = `${origin}/admin/reset-password?token=${resetToken}`;

    // Send reset email via Brevo Transactional Email API
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.warn('BREVO_API_KEY env variable is missing. Reset Link generated: ', resetLink);
      return NextResponse.json({ 
        success: true, 
        message: 'Reset token generated (Brevo API key is not configured yet on Vercel environment variables).' 
      });
    }

    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Kadam Production Console', email: 'kadamproductionweb@gmail.com' },
        to: [{ email: email }],
        subject: 'Admin Password Reset Request',
        htmlContent: `
          <div style="font-family: sans-serif; padding: 24px; background-color: #030303; color: #ffffff; border-radius: 16px; border: 1px solid #333;">
            <h2 style="color: #8B5CF6; border-bottom: 1px solid #222; padding-bottom: 12px; margin-top: 0;">Password Recovery</h2>
            <p style="font-size: 14px; color: #cccccc; line-height: 1.6;">You requested a link to reset your Kadam Production Admin console password. This link is valid for 15 minutes.</p>
            <div style="margin: 32px 0;">
              <a href="${resetLink}" style="background: linear-gradient(to right, #8B5CF6, #EC4899); color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Reset Password Now</a>
            </div>
            <p style="font-size: 12px; color: #555555; margin-bottom: 0;">If you did not request this, you can safely ignore this email.</p>
          </div>
        `
      })
    });

    if (!brevoRes.ok) {
      const brevoError = await brevoRes.text();
      console.error('Brevo API delivery error:', brevoError);
      return NextResponse.json({ error: 'Failed to deliver reset email via Brevo.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
