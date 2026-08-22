import crypto from 'crypto';

export function generatePassword(length = 10): string {
  // Generate random bytes and safely convert to URL-safe string
  return crypto
    .randomBytes(length)
    .toString('base64')
    .replace(/[\+\/]/g, 'a')
    .slice(0, length);
}
