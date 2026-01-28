import { SERVICE_TEMPLATES } from './templates/service-templates';

/**
 * Dados de serviços para seeds
 */
export class ServiceSeedData {
  /**
   * Gera dados dos serviços para um estabelecimento
   */
  static generateServicesForEstablishment(establishmentId: string) {
    return SERVICE_TEMPLATES.map(service => ({
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
