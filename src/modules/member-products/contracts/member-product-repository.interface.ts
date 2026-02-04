import {
  EstablishmentProduct,
  UserProduct as UserProductModel,
} from '@prisma/client';

import { MemberProductWithRelations } from '../types/member-product-with-relations.type';

export interface IMemberProductRepository {
  /**
   * Cria um novo relacionamento entre membro e produto do estabelecimento.
   *
   * @param data - Dados para criação (membro, estabelecimento, produto, preço e comissão)
   * @returns O produto do membro criado
   */
  createMemberProduct(data: {
    memberId: string;
    establishmentId: string;
    productId: string;
    price: number;
    commission: number;
  }): Promise<UserProductModel>;

  /**
   * Busca um MemberProduct com todos os relacionamentos necessários em uma única query.
   *
   * **Otimização de Performance:**
   * Este método foi criado para otimizar operações que requerem múltiplas entidades relacionadas.
   * Ao invés de fazer 3 queries separadas (Establishment, Member, MemberProduct), este método
   * retorna tudo em uma única query com joins, reduzindo:
   * - Latência de rede (1 round-trip vs 3)
   * - Overhead de conexão com o banco
   * - Tempo total de execução (~60-70% mais rápido)
   *
   * **Benefícios:**
   * - Consistência transacional: todos os dados vêm do mesmo snapshot
   * - Type-safety completo com Prisma.GetPayload
   * - Melhor performance em cenários de alta concorrência
   *
   * **Quando usar:**
   * Use este método quando você precisar validar ou acessar:
   * - MemberProduct (entidade principal)
   * - Member relacionado
   * - Establishment relacionado ao Member
   * - EstablishmentProduct relacionado
   *
   * **Exemplo de uso:**
   * ```typescript
   * const memberProduct = await repository.findByMemberEstablishmentProductWithRelations(
   *   memberId,
   *   establishmentId,
   *   productId
   * );
   *
   * if (!memberProduct) {
   *   throw new NotFoundException();
   * }
   *
   * // Acesso direto aos relacionamentos sem queries adicionais
   * const establishment = memberProduct.member.establishment;
   * const member = memberProduct.member;
   * const product = memberProduct.product;
   * ```
   *
   * @param memberId - ID do membro
   * @param establishmentId - ID do estabelecimento
   * @param productId - ID do produto
   * @returns MemberProduct com Member (incluindo Establishment) e EstablishmentProduct, ou null se não encontrado
   *
   * @see MemberProductWithRelations para o tipo de retorno completo
   */
  findByMemberEstablishmentProductWithRelations(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<MemberProductWithRelations | null>;

  /**
   * Verifica se existe um relacionamento entre membro e produto ativo.
   *
   * @param memberId - ID do membro
   * @param establishmentId - ID do estabelecimento
   * @param productId - ID do produto
   * @returns true se existir, false caso contrário
   */
  existsByMemberEstablishmentProduct(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<boolean>;

  /**
   * Lista produtos de um membro de forma paginada.
   *
   * @param params - Parâmetros de filtro e paginação
   * @param params.establishmentId - ID do estabelecimento
   * @param params.memberId - ID do membro
   * @param params.skip - Quantidade de registros para pular
   * @param params.take - Quantidade de registros para retornar
   * @returns Objeto contendo lista de dados e total de registros
   */
  findAllByMemberPaginated({
    establishmentId,
    memberId,
    skip,
    take,
  }: {
    establishmentId: string;
    memberId: string;
    skip: number;
    take: number;
  }): Promise<{
    data: (UserProductModel & { product: EstablishmentProduct })[];
    total: number;
  }>;

  /**
   * Atualiza dados de um produto de membro.
   *
   * @param id - ID do relacionamento
   * @param data - Dados para atualização (preço e/ou comissão)
   * @returns O produto do membro atualizado
   */
  updateMemberProduct(
    id: string,
    data: {
      price?: number;
      commission?: number;
    },
  ): Promise<UserProductModel>;

  /**
   * Realiza o soft delete de um produto de membro.
   *
   * @param id - ID do relacionamento
   * @param deletedBy - ID do usuário que realizou a exclusão
   */
  deleteMemberProduct(id: string, deletedBy: string): Promise<void>;

  /**
   * Busca um produto de membro específico incluindo dados do produto do estabelecimento.
   *
   * @param memberId - ID do membro
   * @param establishmentId - ID do estabelecimento
   * @param productId - ID do produto
   * @returns Dados do produto do membro com o produto do estabelecimento incluso, ou null
   */
  findOneByMemberProduct(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<(UserProductModel & { product: EstablishmentProduct }) | null>;

  /**
   * Busca associação por membro, estabelecimento e produto incluindo registros soft-deleted.
   * 
   * Usado principalmente no fluxo de criação para permitir a restauração de um registro 
   * deletado anteriormente, evitando violação de restrição única.
   * 
   * @param memberId - ID do membro
   * @param establishmentId - ID do estabelecimento
   * @param productId - ID do produto
   * @returns O registro encontrado (mesmo se deletado) ou null
   */
  findOneByMemberEstablishmentProductIncludingDeleted(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<UserProductModel | null>;

  /**
   * Restaura um MemberProduct que foi soft-deleted.
   * 
   * Limpa os campos deletedAt e deletedBy, e atualiza o preço e comissão com os novos valores fornecidos.
   * 
   * @param id - ID do registro a ser restaurado
   * @param data - Novos dados de preço e comissão
   * @returns O registro restaurado e atualizado
   */
  restoreMemberProduct(
    id: string,
    data: { price: number; commission: number },
  ): Promise<UserProductModel>;
}
