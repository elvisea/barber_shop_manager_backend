import { createCipheriv, randomBytes } from 'crypto';

/**
 * Utilitário para criptografar dados nos seeds usando AES-256-GCM
 * Mesma lógica do EncryptionService, mas sem dependência do NestJS
 */
export class SeedEncryption {
  private static getEncryptionKey(): Buffer {
    const encryptionKey = process.env.ENCRYPTION_KEY;

    if (!encryptionKey) {
      throw new Error(
        'ENCRYPTION_KEY environment variable is required for encryption',
      );
    }

    // ENCRYPTION_KEY should be 32 bytes (256 bits) for AES-256
    // If it's a hex string, convert it; otherwise use it directly
    if (encryptionKey.length === 64) {
      // Assume it's a hex string (64 chars = 32 bytes in hex)
      return Buffer.from(encryptionKey, 'hex');
    } else {
      // Use as-is, but ensure it's exactly 32 bytes
      const key = Buffer.from(encryptionKey);
      if (key.length !== 32) {
        throw new Error(
          'ENCRYPTION_KEY must be exactly 32 bytes (256 bits) for AES-256',
        );
      }
      return key;
    }
  }

  /**
   * Criptografa um valor usando AES-256-GCM
   * Formato: iv:authTag:encryptedData (todos em base64)
   */
  static encrypt(value: string): string {
    if (!value || typeof value !== 'string') {
      throw new Error('Value to encrypt must be a non-empty string');
    }

    const key = this.getEncryptionKey();
    // GCM requires 12 bytes IV
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);

    // Encrypt the value
    let encrypted = cipher.update(value, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // Get the authentication tag (required for GCM)
    const authTag = cipher.getAuthTag();

    // Return format: iv:authTag:encryptedData (all base64)
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  }
}
