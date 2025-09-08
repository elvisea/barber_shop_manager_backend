
/**
 * Dados de produtos para seeds
 */
export class ProductSeedData {
  private static readonly PRODUCT_TEMPLATES = [
    {
      name: 'Pomada para Cabelo',
      description: 'Pomada fixadora para cabelo masculino',
      price: 3500, // R$ 35,00
    },
    {
      name: 'Gel Fixador',
      description: 'Gel com fixação forte para cabelos',
      price: 2800, // R$ 28,00
    },
    {
      name: 'Shampoo Masculino',
      description: 'Shampoo específico para homens',
      price: 2200, // R$ 22,00
    },
    {
      name: 'Condicionador',
      description: 'Condicionador para hidratação',
      price: 2500, // R$ 25,00
    },
    {
      name: 'Óleo para Barba',
      description: 'Óleo hidratante para barba',
      price: 4000, // R$ 40,00
    },
    {
      name: 'Loção Pós-Barba',
      description: 'Loção refrescante pós-barba',
      price: 3200, // R$ 32,00
    },
  ];

  /**
   * Gera dados dos produtos para um estabelecimento
   */
  static generateProductsForEstablishment(establishmentId: string) {
    return this.PRODUCT_TEMPLATES.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      commission: 0.10, // 10% de comissão padrão
      stock: 100, // Estoque padrão
      establishmentId,
    }));
  }

  /**
   * Gera todos os produtos para todos os estabelecimentos
   */
  static generateAllProducts(establishments: Array<{ id: string }>) {
    const allProducts: Array<{
      name: string;
      description: string;
      price: number;
      commission: number;
      stock: number;
      establishmentId: string;
    }> = [];

    for (const establishment of establishments) {
      const establishmentProducts = this.generateProductsForEstablishment(establishment.id);
      allProducts.push(...establishmentProducts);
    }

    return allProducts;
  }
}
