import { DataGenerator } from '../utils/generate-data';

/**
 * Dados de clientes para seeds
 */
export class CustomerSeedData {
  /**
   * Gera dados dos clientes para um estabelecimento
   */
  static generateCustomersForEstablishment(establishmentId: string) {
    const customers: Array<{
      name: string;
      email: string;
      phone: string;
      establishmentId: string;
    }> = [];

    for (let i = 1; i <= 5; i++) {
      const name = DataGenerator.generateBrazilianName();
      const email = DataGenerator.generateEmail(name, 'cliente.com');

      customers.push({
        name,
        email,
        phone: DataGenerator.generateBrazilianPhone(),
        establishmentId,
      });
    }

    return customers;
  }

  /**
   * Gera todos os clientes para todos os estabelecimentos
   */
  static generateAllCustomers(establishments: Array<{ id: string }>) {
    const allCustomers: Array<{
      name: string;
      email: string;
      phone: string;
      establishmentId: string;
    }> = [];

    for (const establishment of establishments) {
      const establishmentCustomers = this.generateCustomersForEstablishment(establishment.id);
      allCustomers.push(...establishmentCustomers);
    }

    return allCustomers;
  }
}
