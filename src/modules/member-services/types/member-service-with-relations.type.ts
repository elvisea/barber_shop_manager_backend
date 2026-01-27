import { Prisma } from '@prisma/client';

/**
 * Tipo que representa um MemberService com todos os relacionamentos necessários
 * para validações e operações de negócio.
 *
 * Este tipo é gerado usando Prisma.GetPayload para garantir type-safety completo
 * e autocomplete em todos os níveis de relacionamento.
 *
 * @example
 * ```typescript
 * const memberService: MemberServiceWithRelations = await repository
 *   .findByMemberEstablishmentServiceWithRelations(memberId, establishmentId, serviceId);
 *
 * // Acesso type-safe aos relacionamentos:
 * const establishment = memberService.member.establishment;
 * const member = memberService.member;
 * const service = memberService.service;
 * ```
 *
 * @see Prisma.MemberServiceGetPayload para mais informações sobre como o tipo é gerado
 */
export type MemberServiceWithRelations = Prisma.MemberServiceGetPayload<{
  include: {
    member: {
      include: {
        establishment: true;
      };
    };
    service: true;
  };
}>;
