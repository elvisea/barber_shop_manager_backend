import { UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import { PasswordHasher } from '../utils/hash-password';
import { SeedEncryption } from '../utils/encrypt';

/**
 * Dados de usuários para seeds
 */
export class UserSeedData {
  private static readonly DEFAULT_PASSWORD = 'Str0ngP@ssw0rd!';

  /**
   * Gera código aleatório
   */
  private static generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Gera dados de verificação de email
   */
  private static async generateEmailVerificationData() {
    const token = this.generateRandomCode(6);
    const hashedToken = await hash(token, 10);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    return { token: hashedToken, expiresAt };
  }

  /**
   * Gera dados dos usuários
   */
  static async generateUsers() {
    const hashedPassword = await PasswordHasher.hashPassword(this.DEFAULT_PASSWORD);

    // CPFs de exemplo para seeds (já limpos, sem formatação)
    const ownerCpf = '12345678909';
    const rootCpf = '98765432100';

    // Criptografar CPFs
    const encryptedOwnerCpf = SeedEncryption.encrypt(ownerCpf);
    const encryptedRootCpf = SeedEncryption.encrypt(rootCpf);

    return [
      {
        email: 'owner@bytefulcode.tech',
        name: 'João Silva',
        phone: '+5511999888777',
        password: hashedPassword,
        document: encryptedOwnerCpf,
        role: UserRole.OWNER,
      },
      {
        email: 'root@bytefulcode.tech',
        name: 'Admin Sistema',
        phone: '+5511888777666',
        password: hashedPassword,
        document: encryptedRootCpf,
        role: UserRole.ROOT,
      },
    ];
  }

  /**
   * Gera dados de verificação de email para usuários
   */
  static async generateUserEmailVerifications(users: Array<{ id: string; email: string }>) {
    const verifications: Array<{
      email: string;
      token: string;
      expiresAt: Date;
      verified: boolean;
      userId: string;
    }> = [];

    for (const user of users) {
      const verificationData = await this.generateEmailVerificationData();
      verifications.push({
        email: user.email,
        token: verificationData.token,
        expiresAt: verificationData.expiresAt,
        verified: true,
        userId: user.id,
      });
    }

    return verifications;
  }
}
