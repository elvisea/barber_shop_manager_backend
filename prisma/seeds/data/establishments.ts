import { DataGenerator } from '../utils/generate-data';
import { generateE164BrazilianPhone } from '../utils/phone-e164';

/**
 * Dados de estabelecimentos para seeds.
 * Recebe apenas usuários OWNER; gera 2 estabelecimentos por owner.
 */
export class EstablishmentSeedData {
  /**
   * Gera dados dos estabelecimentos para um owner (2 estabelecimentos)
   */
  static generateEstablishmentsForOwner(
    ownerId: string,
    usedPhones: Set<string>,
  ): Array<{ name: string; address: string; phone: string; ownerId: string }> {
    const establishments: Array<{
      name: string;
      address: string;
      phone: string;
      ownerId: string;
    }> = [];

    for (let i = 1; i <= 2; i++) {
      establishments.push({
        name: `${DataGenerator.generateEstablishmentName()} ${i}`,
        address: DataGenerator.generateBrazilianAddress(),
        phone: generateE164BrazilianPhone(usedPhones),
        ownerId,
      });
    }

    return establishments;
  }

  /**
   * Gera todos os estabelecimentos para os owners (apenas role OWNER).
   * Total: 2 owners x 2 = 4 estabelecimentos.
   */
  static generateAllEstablishments(
    owners: Array<{ id: string; role: string }>,
    usedPhones: Set<string>,
  ): Array<{ name: string; address: string; phone: string; ownerId: string }> {
    const allEstablishments: Array<{
      name: string;
      address: string;
      phone: string;
      ownerId: string;
    }> = [];

    for (const owner of owners) {
      if (owner.role !== 'OWNER') continue;
      const establishments = this.generateEstablishmentsForOwner(owner.id, usedPhones);
      allEstablishments.push(...establishments);
    }

    return allEstablishments;
  }
}
