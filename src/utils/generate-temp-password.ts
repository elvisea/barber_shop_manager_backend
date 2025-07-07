import { randomBytes } from 'crypto';

/**
 * Generates a secure temporary password with the given length.
 * Only alphanumeric characters.
 */
export function generateTempPassword(length: number): string {
  return randomBytes(length)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, length);
}
