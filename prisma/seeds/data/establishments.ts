import { DataGenerator } from '../utils/generate-data';

/**
 * Dados de estabelecimentos para seeds
 */
export class EstablishmentSeedData {
  /**
   * Gera dados dos estabelecimentos para um usuário
   */
  static generateEstablishmentsForUser(userId: string, userRole: string) {
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
        phone: DataGenerator.generateBrazilianPhone(),
        ownerId: userId,
      });
    }

    return establishments;
  }

  /**
   * Gera todos os estabelecimentos para todos os usuários
   */
  static generateAllEstablishments(users: Array<{ id: string; role: string }>) {
    const allEstablishments: Array<{
      name: string;
      address: string;
      phone: string;
      ownerId: string;
    }> = [];

    for (const user of users) {
      const userEstablishments = this.generateEstablishmentsForUser(user.id, user.role);
      allEstablishments.push(...userEstablishments);
    }

    return allEstablishments;
  }
}
