import { PRODUCT_TEMPLATES } from './templates/product-templates';

/**
 * Dados de produtos para seeds
 */
export class ProductSeedData {
  /**
   * Gera dados dos produtos para um estabelecimento
   */
  static generateProductsForEstablishment(establishmentId: string) {
    return PRODUCT_TEMPLATES.map(product => ({
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
