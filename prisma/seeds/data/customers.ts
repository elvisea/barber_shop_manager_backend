import { DataGenerator } from '../utils/generate-data';
import { generateE164BrazilianPhone } from '../utils/phone-e164';

const SEED_DOMAIN = 'barbershopmanager.com.br';

/**
 * Dados de clientes para seeds.
 * 15 clientes por estabelecimento; emails e telefones únicos (E.164).
 */
export class CustomerSeedData {
  /**
   * Gera dados de 15 clientes para um estabelecimento.
   *
   * @param establishmentId ID do estabelecimento
   * @param establishmentIndex Índice do estabelecimento (para email único)
   * @param usedPhones Set de telefones já usados (E.164) - evita duplicatas entre estabelecimentos
   */
  static generateCustomersForEstablishment(
    establishmentId: string,
    establishmentIndex: number,
    usedPhones: Set<string>,
  ): Array<{
    name: string;
    email: string;
    phone: string;
    establishmentId: string;
  }> {
    const customers: Array<{
      name: string;
      email: string;
      phone: string;
      establishmentId: string;
    }> = [];

    for (let i = 0; i < 15; i++) {
      const name = DataGenerator.generateBrazilianName();
      const email = `cliente-${i}-est-${establishmentIndex}@${SEED_DOMAIN}`;
      const phone = generateE164BrazilianPhone(usedPhones);

      customers.push({
        name,
        email,
        phone,
        establishmentId,
      });
    }

    return customers;
  }

  /**
   * Gera todos os clientes para todos os estabelecimentos (15 por estabelecimento).
   */
  static generateAllCustomers(
    establishments: Array<{ id: string }>,
    usedPhones: Set<string>,
  ): Array<{
    name: string;
    email: string;
    phone: string;
    establishmentId: string;
  }> {
    const allCustomers: Array<{
      name: string;
      email: string;
      phone: string;
      establishmentId: string;
    }> = [];

    establishments.forEach((est, index) => {
      const establishmentCustomers = this.generateCustomersForEstablishment(
        est.id,
        index,
        usedPhones,
      );
      allCustomers.push(...establishmentCustomers);
    });

    return allCustomers;
  }
}
