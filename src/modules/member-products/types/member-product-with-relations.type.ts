import { Prisma } from '@prisma/client';

/**
 * Tipo que representa um MemberProduct com todos os relacionamentos necessários
 * para validações e operações de negócio.
 *
 * Este tipo é gerado usando Prisma.GetPayload para garantir type-safety completo
 * e autocomplete em todos os níveis de relacionamento.
 *
 * @example
 * ```typescript
 * const memberProduct: MemberProductWithRelations = await repository
 *   .findByMemberEstablishmentProductWithRelations(memberId, establishmentId, productId);
 *
 * // Acesso type-safe aos relacionamentos:
 * const establishment = memberProduct.member.establishment;
 * const member = memberProduct.member;
 * const product = memberProduct.product;
 * ```
 *
 * @see Prisma.MemberProductGetPayload para mais informações sobre como o tipo é gerado
 */
export type MemberProductWithRelations = Prisma.UserProductGetPayload<{
  include: {
    user: true;
    product: {
      include: {
        establishment: true;
      };
    };
  };
}>;
