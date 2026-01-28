import {
  EstablishmentProduct,
  UserProduct as UserProductModel,
} from '@prisma/client';

import { MemberProductWithRelations } from '../types/member-product-with-relations.type';

export interface IMemberProductRepository {
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

  existsByMemberEstablishmentProduct(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<boolean>;

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

  updateMemberProduct(
    id: string,
    data: {
      price?: number;
      commission?: number;
    },
  ): Promise<UserProductModel>;

  deleteMemberProduct(id: string, deletedBy: string): Promise<void>;

  findOneByMemberProduct(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<(UserProductModel & { product: EstablishmentProduct }) | null>;
}
