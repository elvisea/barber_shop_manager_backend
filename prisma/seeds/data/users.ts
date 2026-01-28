import { UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import { SeedEncryption } from '../utils/encrypt';

const SEED_DOMAIN = 'barbershopmanager.com.br';

/**
 * Dados de usuários para seeds (root + owners)
 */
export class UserSeedData {
  /**
   * Gera código aleatório para tokens
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
   * Gera dados dos usuários: 1 ROOT + 2 OWNER.
   * Emails @barbershopmanager.com.br, telefones E.164 fixos.
   *
   * @param hashedPassword Senha já hasheada (usar SEED_PASSWORD do env)
   */
  static async generateUsers(hashedPassword: string) {
    const ownerCpf1 = '12345678909';
    const ownerCpf2 = '11144477735';
    const rootCpf = '98765432100';

    const encryptedOwnerCpf1 = SeedEncryption.encrypt(ownerCpf1);
    const encryptedOwnerCpf2 = SeedEncryption.encrypt(ownerCpf2);
    const encryptedRootCpf = SeedEncryption.encrypt(rootCpf);

    return [
      {
        email: `root@${SEED_DOMAIN}`,
        name: 'Admin Sistema',
        phone: '+5511999999001',
        password: hashedPassword,
        document: encryptedRootCpf,
        role: UserRole.ROOT,
        emailVerified: true,
      },
      {
        email: `owner1@${SEED_DOMAIN}`,
        name: 'João Silva',
        phone: '+5511999999002',
        password: hashedPassword,
        document: encryptedOwnerCpf1,
        role: UserRole.OWNER,
        emailVerified: true,
      },
      {
        email: `owner2@${SEED_DOMAIN}`,
        name: 'Maria Santos',
        phone: '+5511999999003',
        password: hashedPassword,
        document: encryptedOwnerCpf2,
        role: UserRole.OWNER,
        emailVerified: true,
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
