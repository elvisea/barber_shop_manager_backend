import { UserRole } from '@prisma/client';
import { DataGenerator } from '../utils/generate-data';
import { SeedEncryption } from '../utils/encrypt';
import { generateE164BrazilianPhone } from '../utils/phone-e164';
import { FAKE_CPF_POOL } from './templates/fake-cpf-pool';

const SEED_DOMAIN = 'barbershopmanager.com.br';

/**
 * Dados de membros (funcionários) para seeds.
 * Cada membro é um User + UserEstablishment (6 por estabelecimento: 2 RECEPTIONIST, 2 HAIRDRESSER, 2 BARBER).
 */
export class MemberSeedData {
  /**
   * Gera dados de 6 membros para um estabelecimento.
   * Retorna dados para criar User e depois UserEstablishment.
   *
   * @param establishmentId ID do estabelecimento
   * @param establishmentIndex Índice do estabelecimento (para email único)
   * @param hashedPassword Senha já hasheada (SEED_PASSWORD)
   * @param usedPhones Set de telefones já usados (E.164)
   */
  static generateMembersForEstablishment(
    establishmentId: string,
    establishmentIndex: number,
    hashedPassword: string,
    usedPhones: Set<string>,
  ): Array<{
    user: {
      name: string;
      email: string;
      phone: string;
      password: string;
      document: string;
      role: UserRole;
      emailVerified: boolean;
    };
    establishmentId: string;
    role: UserRole;
  }> {
    const roleCounts: Array<{ role: UserRole; count: number }> = [
      { role: UserRole.RECEPTIONIST, count: 2 },
      { role: UserRole.HAIRDRESSER, count: 2 },
      { role: UserRole.BARBER, count: 2 },
    ];

    const result: Array<{
      user: {
        name: string;
        email: string;
        phone: string;
        password: string;
        document: string;
        role: UserRole;
        emailVerified: boolean;
      };
      establishmentId: string;
      role: UserRole;
    }> = [];

    let cpfIndex = 0;

    for (const { role, count } of roleCounts) {
      const roleSlug = role.toLowerCase();
      for (let i = 0; i < count; i++) {
        const name = DataGenerator.generateBrazilianName();
        const email = `${roleSlug}-${i}-est-${establishmentIndex}@${SEED_DOMAIN}`;
        const phone = generateE164BrazilianPhone(usedPhones);
        const cpf = FAKE_CPF_POOL[cpfIndex % FAKE_CPF_POOL.length];
        cpfIndex += 1;
        const document = SeedEncryption.encrypt(cpf);

        result.push({
          user: {
            name,
            email,
            phone,
            password: hashedPassword,
            document,
            role,
            emailVerified: true,
          },
          establishmentId,
          role,
        });
      }
    }

    return result;
  }

  /**
   * Gera todos os membros para todos os estabelecimentos.
   */
  static generateAllMembers(
    establishments: Array<{ id: string }>,
    hashedPassword: string,
    usedPhones: Set<string>,
  ): Array<{
    user: {
      name: string;
      email: string;
      phone: string;
      password: string;
      document: string;
      role: UserRole;
      emailVerified: boolean;
    };
    establishmentId: string;
    role: UserRole;
  }> {
    const all: Array<{
      user: {
        name: string;
        email: string;
        phone: string;
        password: string;
        document: string;
        role: UserRole;
        emailVerified: boolean;
      };
      establishmentId: string;
      role: UserRole;
    }> = [];

    establishments.forEach((est, index) => {
      const members = this.generateMembersForEstablishment(
        est.id,
        index,
        hashedPassword,
        usedPhones,
      );
      all.push(...members);
    });

    return all;
  }
}
