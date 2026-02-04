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
export type MemberServiceWithRelations = Prisma.UserServiceGetPayload<{
  include: {
    user: true;
    service: {
      include: {
        establishment: true;
      };
    };
  };
}>;

/**
 * Tipo que representa um MemberService apenas com o relacionamento do serviço base.
 *
 * Usado no fluxo de criação de agendamentos para validação e cálculos
 * que utilizam os dados personalizados do funcionário (preço, duração, comissão).
 *
 * @example
 * ```typescript
 * const services: MemberServiceWithEstablishmentService[] =
 *   await repository.findManyByMemberAndServices(memberId, establishmentId, serviceIds);
 *
 * const totalPrice = services.reduce((sum, s) => sum + s.price, 0);
 * ```
 */
export type MemberServiceWithEstablishmentService =
  Prisma.UserServiceGetPayload<{
    include: {
      service: true;
    };
  }>;
