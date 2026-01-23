import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service responsável por criptografar e descriptografar valores usando AES-256-GCM.
 *
 * Este service usa ConfigService para obter a chave de criptografia,
 * seguindo o padrão da aplicação para variáveis de ambiente.
 *
 * @example
 * ```typescript
 * // No construtor do seu service:
 * constructor(private readonly encryptionService: EncryptionService) {}
 *
 * // Para criptografar:
 * const encrypted = this.encryptionService.encrypt('12345678900');
 *
 * // Para descriptografar:
 * const decrypted = this.encryptionService.decrypt(encrypted);
 * ```
 */
@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly encryptionKey: Buffer;

  constructor(private readonly configService: ConfigService) {
    const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');

    if (!encryptionKey) {
      throw new Error(
        'ENCRYPTION_KEY environment variable is required for encryption',
      );
    }

    // ENCRYPTION_KEY should be 32 bytes (256 bits) for AES-256
    // If it's a hex string, convert it; otherwise use it directly
    if (encryptionKey.length === 64) {
      // Assume it's a hex string (64 chars = 32 bytes in hex)
      this.encryptionKey = Buffer.from(encryptionKey, 'hex');
    } else {
      // Use as-is, but ensure it's exactly 32 bytes
      this.encryptionKey = Buffer.from(encryptionKey);
      if (this.encryptionKey.length !== 32) {
        throw new Error(
          'ENCRYPTION_KEY must be exactly 32 bytes (256 bits) for AES-256',
        );
      }
    }

    this.logger.debug('EncryptionService initialized');
  }

  /**
   * Encrypts a value using AES-256-GCM.
   *
   * The encrypted value format is: iv:authTag:encryptedData (all base64 encoded)
   * This allows us to decrypt the value later when needed.
   *
   * @param value - The value to encrypt (e.g., CPF)
   * @returns The encrypted value in format "iv:authTag:encryptedData" (all base64)
   * @throws Error if encryption fails
   *
   * @example
   * ```typescript
   * const encrypted = encryptionService.encrypt('12345678900');
   * // Returns: "iv:authTag:encryptedData" (base64 encoded)
   * ```
   */
  encrypt(value: string): string {
    if (!value || typeof value !== 'string') {
      throw new Error('Value to encrypt must be a non-empty string');
    }

    // Generate a random IV (Initialization Vector) for each encryption
    // GCM requires 12 bytes IV
    const iv = randomBytes(12);

    // Create cipher with AES-256-GCM
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv);

    // Encrypt the value
    let encrypted = cipher.update(value, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // Get the authentication tag (required for GCM)
    const authTag = cipher.getAuthTag();

    // Return format: iv:authTag:encryptedData (all base64)
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  }

  /**
   * Decrypts a value that was encrypted using AES-256-GCM.
   *
   * Expects the encrypted value format: iv:authTag:encryptedData (all base64 encoded)
   *
   * @param encryptedValue - The encrypted value in format "iv:authTag:encryptedData" (all base64)
   * @returns The decrypted value (e.g., CPF)
   * @throws Error if decryption fails or the encrypted value format is invalid
   *
   * @example
   * ```typescript
   * const decrypted = encryptionService.decrypt(encryptedValue);
   * // Returns: "12345678900"
   * ```
   */
  decrypt(encryptedValue: string): string {
    if (!encryptedValue || typeof encryptedValue !== 'string') {
      throw new Error('Encrypted value must be a non-empty string');
    }

    // Parse the encrypted value format: iv:authTag:encryptedData
    const parts = encryptedValue.split(':');
    if (parts.length !== 3) {
      throw new Error(
        'Invalid encrypted value format. Expected format: iv:authTag:encryptedData',
      );
    }

    const [ivBase64, authTagBase64, encryptedData] = parts;

    // Decode IV and auth tag from base64
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');

    // Create decipher with AES-256-GCM
    const decipher = createDecipheriv('aes-256-gcm', this.encryptionKey, iv);

    // Set the authentication tag (required for GCM)
    decipher.setAuthTag(authTag);

    // Decrypt the value
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
