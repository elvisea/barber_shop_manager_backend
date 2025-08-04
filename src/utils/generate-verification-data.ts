import { generateRandomCode } from './generate-random-code';
import { hashValue } from './hash-value';

export interface VerificationData {
  token: string;
  hashedToken: string;
  expiresAt: Date;
}

/**
 * Generates verification data with hashed token.
 *
 * @param expirationMinutes - Minutes until expiration.
 * @param codeLength - Length of the verification code (default: 6).
 * @returns Object containing plain token, hashed token, and expiration date.
 */
export async function generateVerificationData(
  expirationMinutes: number,
  codeLength: number = 6,
): Promise<VerificationData> {
  // Generate random code
  const token = generateRandomCode(codeLength);

  // Hash the token for database storage
  const hashedToken = await hashValue(token);

  // Calculate expiration date
  const expiresAt = new Date(Date.now() + expirationMinutes * 60000); // 60000 milliseconds = 1 minute

  return { token, hashedToken, expiresAt };
}
