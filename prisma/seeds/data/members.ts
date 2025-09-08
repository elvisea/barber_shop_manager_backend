import { MemberRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import { DataGenerator } from '../utils/generate-data';
import { PasswordHasher } from '../utils/hash-password';

/**
 * Dados de membros para seeds
 */
export class MemberSeedData {
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
   * Gera dados dos membros para um estabelecimento
   */
  static async generateMembersForEstablishment(establishmentId: string) {
    const hashedPassword = await PasswordHasher.hashPassword(this.DEFAULT_PASSWORD);

    const roles = [MemberRole.RECEPTIONIST, MemberRole.HAIRDRESSER, MemberRole.BARBER];
    const members: Array<{
      name: string;
      email: string;
      phone: string;
      password: string;
      role: MemberRole;
      establishmentId: string;
      isActive: boolean;
    }> = [];

    for (const role of roles) {
      const name = DataGenerator.generateBrazilianName();
      const email = DataGenerator.generateEmail(name, 'barbearia.com');

      members.push({
        name,
        email,
        phone: DataGenerator.generateBrazilianPhone(),
        password: hashedPassword,
        role,
        establishmentId,
        isActive: true,
      });
    }

    return members;
  }

  /**
   * Gera todos os membros para todos os estabelecimentos
   */
  static async generateAllMembers(establishments: Array<{ id: string }>) {
    const allMembers: Array<{
      name: string;
      email: string;
      phone: string;
      password: string;
      role: MemberRole;
      establishmentId: string;
      isActive: boolean;
    }> = [];

    for (const establishment of establishments) {
      const establishmentMembers = await this.generateMembersForEstablishment(establishment.id);
      allMembers.push(...establishmentMembers);
    }

    return allMembers;
  }

  /**
   * Gera dados de verificação de email para membros
   */
  static async generateMemberEmailVerifications(members: Array<{ id: string; email: string }>) {
    const verifications: Array<{
      email: string;
      token: string;
      expiresAt: Date;
      verified: boolean;
      memberId: string;
    }> = [];

    for (const member of members) {
      const verificationData = await this.generateEmailVerificationData();
      verifications.push({
        email: member.email,
        token: verificationData.token,
        expiresAt: verificationData.expiresAt,
        verified: true,
        memberId: member.id,
      });
    }

    return verifications;
  }
}
