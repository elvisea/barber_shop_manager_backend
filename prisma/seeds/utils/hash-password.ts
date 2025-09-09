import { hash } from 'bcryptjs';

/**
 * Utilitário para hash de senhas usando bcrypt
 */
export class PasswordHasher {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Gera hash da senha usando bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return hash(password, this.SALT_ROUNDS);
  }
}
