import { compare } from 'bcryptjs';

/**
 * Verifies a code against its hashed version.
 *
 * @param code - The plain code to verify.
 * @param hashedCode - The hashed code from database.
 * @returns True if the code matches, false otherwise.
 */
export async function verifyCode(
  code: string,
  hashedCode: string,
): Promise<boolean> {
  return compare(code, hashedCode);
}
