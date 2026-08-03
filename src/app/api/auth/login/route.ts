import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { verifyPassword } from '@/utils/crypto';

// Simple delay helper to align response times
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password.trim() : '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();

    // Check account lockout
    const now = Date.now();
    const lockoutUntil = credentials.otpExpiry || 0; // reuse otpExpiry slot or general state for lockout
    
    // We check if lockout is active (if lockoutUntil is defined and in the future)
    // To represent lockout, we check if resetCount is >= 5 AND resetPeriodStart is set to lockout end time
    const failedAttempts = credentials.resetCount || 0;
    const isLocked = credentials.resetPeriodStart && now < credentials.resetPeriodStart;

    if (isLocked) {
      const remainingMinutes = Math.ceil((credentials.resetPeriodStart! - now) / 60000);
      return NextResponse.json({ 
        error: `Too many failed login attempts. Account is locked. Please try again in ${remainingMinutes} minutes.` 
      }, { status: 403 });
    }

    // Match username OR default email, and password
    const isUserMatch = email === credentials.username || email === 'kadamproductionweb@gmail.com' || email === 'admin';
    
    // We use timing safe scrypt verification
    const isPassMatch = isUserMatch ? verifyPassword(password, credentials.passwordHash) : false;

    if (isUserMatch && isPassMatch) {
      // Clear failed attempts on successful login
      credentials.resetCount = 0;
      credentials.resetPeriodStart = null;
      await vercelDb.setCredentials(credentials);

      // Create a 24-hour expiration token
      const payload = {
        username: credentials.username,
        exp: Date.now() + 24 * 60 * 60 * 1000
      };
      const token = Buffer.from(JSON.stringify(payload)).toString('base64');
      
      // Ensure timing consistency
      const elapsed = Date.now() - startTime;
      if (elapsed < 300) {
        await delay(300 - elapsed);
      }

      return NextResponse.json({ 
        success: true, 
        token, 
        user: { 
          id: 'admin-id-1', 
          email: 'kadamproductionweb@gmail.com' 
        } 
      });
    }

    // Increment failed login attempts
    const newFailedAttempts = failedAttempts + 1;
    credentials.resetCount = newFailedAttempts;

    if (newFailedAttempts >= 5) {
      // Lock account for 15 minutes
      credentials.resetPeriodStart = Date.now() + 15 * 60 * 1000;
    }
    await vercelDb.setCredentials(credentials);

    // Timing consistency for failed attempts
    const elapsed = Date.now() - startTime;
    if (elapsed < 300) {
      await delay(300 - elapsed);
    }

    return NextResponse.json({ error: 'Invalid login credentials.' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
