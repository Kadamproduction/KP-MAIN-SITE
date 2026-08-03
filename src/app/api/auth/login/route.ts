import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { verifyPassword } from '@/utils/crypto';

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

// Simple delay helper to align response times
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? sanitizeInput(body.email, 'email') : '';
    const password = typeof body.password === 'string' ? sanitizeInput(body.password, 'password') : '';

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
    const cleanDbUsername = typeof credentials.username === 'string' ? sanitizeInput(credentials.username, 'email') : 'admin';
    const cleanDbPasswordHash = typeof credentials.passwordHash === 'string' ? sanitizeInput(credentials.passwordHash, 'password') : '';

    const isUserMatch = email === cleanDbUsername || email === 'kadamproductionweb@gmail.com' || email === 'admin';
    
    // We use timing safe scrypt verification
    const isPassMatch = isUserMatch ? verifyPassword(password, cleanDbPasswordHash) : false;

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
