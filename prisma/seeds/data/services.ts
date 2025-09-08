
/**
 * Dados de serviços para seeds
 */
export class ServiceSeedData {
  private static readonly SERVICE_TEMPLATES = [
    {
      name: 'Corte de Cabelo Masculino',
      description: 'Corte moderno e estiloso para homens',
      price: 2500, // R$ 25,00
      duration: 30,
    },
    {
      name: 'Barba Completa',
      description: 'Aparar e modelar barba com navalha',
      price: 2000, // R$ 20,00
      duration: 25,
    },
    {
      name: 'Corte + Barba',
      description: 'Corte de cabelo + barba completa',
      price: 4000, // R$ 40,00
      duration: 50,
    },
    {
      name: 'Sobrancelha',
      description: 'Design e limpeza de sobrancelhas',
      price: 1500, // R$ 15,00
      duration: 15,
    },
    {
      name: 'Lavagem + Hidratação',
      description: 'Lavagem profissional com hidratação',
      price: 3000, // R$ 30,00
      duration: 45,
    },
    {
      name: 'Corte Infantil',
      description: 'Corte especializado para crianças',
      price: 1800, // R$ 18,00
      duration: 20,
    },
  ];

  /**
   * Gera dados dos serviços para um estabelecimento
   */
  static generateServicesForEstablishment(establishmentId: string) {
    return this.SERVICE_TEMPLATES.map(service => ({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      commission: 0.15, // 15% de comissão padrão
      establishmentId,
    }));
  }

  /**
   * Gera todos os serviços para todos os estabelecimentos
   */
  static generateAllServices(establishments: Array<{ id: string }>) {
    const allServices: Array<{
      name: string;
      description: string;
      price: number;
      duration: number;
      commission: number;
      establishmentId: string;
    }> = [];

    for (const establishment of establishments) {
      const establishmentServices = this.generateServicesForEstablishment(establishment.id);
      allServices.push(...establishmentServices);
    }

    return allServices;
  }
}
