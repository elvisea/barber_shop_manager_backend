import { hash } from 'bcryptjs';

/**
 * Hashes a value using bcryptjs.
 *
 * @param value - The value to hash.
 * @returns The hashed value.
 */
export async function hashValue(value: string): Promise<string> {
  return hash(value, 10);
}
