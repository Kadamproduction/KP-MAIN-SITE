import crypto from 'crypto';

// Hash a password with scrypt (slow KDF)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex');
  return `${salt}:${hash}`;
}

// Verify a password using timing-safe comparison
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  
  // If storedHash is not in "salt:hash" format (e.g. legacy plain text), do a direct match to prevent lockout
  if (!storedHash.includes(':')) {
    return password === storedHash;
  }
  
  const [salt, hash] = storedHash.split(':');
  const checkHash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex');
  
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(checkHash, 'hex'));
}

// Compare two strings in constant time to prevent timing attacks
export function constantTimeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}
