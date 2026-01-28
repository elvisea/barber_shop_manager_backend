import { EstablishmentService, UserService } from '@prisma/client';

import { MemberServiceWithRelations } from '../types/member-service-with-relations.type';

export interface IMemberServiceRepository {
  createMemberService(data: {
    memberId: string;
    establishmentId: string;
    serviceId: string;
    price: number;
    commission: number;
    duration: number;
  }): Promise<UserService>;

  /**
   * Busca um MemberService com todos os relacionamentos necessários em uma única query.
   *
   * **Otimização de Performance:**
   * Este método foi criado para otimizar operações que requerem múltiplas entidades relacionadas.
   * Ao invés de fazer 3 queries separadas (Establishment, Member, MemberService), este método
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
   * - MemberService (entidade principal)
   * - Member relacionado
   * - Establishment relacionado ao Member
   * - EstablishmentService relacionado
   *
   * **Exemplo de uso:**
   * ```typescript
   * const memberService = await repository.findByMemberEstablishmentServiceWithRelations(
   *   memberId,
   *   establishmentId,
   *   serviceId
   * );
   *
   * if (!memberService) {
   *   throw new NotFoundException();
   * }
   *
   * // Acesso direto aos relacionamentos sem queries adicionais
   * const establishment = memberService.member.establishment;
   * const member = memberService.member;
   * const service = memberService.service;
   * ```
   *
   * @param memberId - ID do membro
   * @param establishmentId - ID do estabelecimento
   * @param serviceId - ID do serviço
   * @returns MemberService com Member (incluindo Establishment) e EstablishmentService, ou null se não encontrado
   *
   * @see MemberServiceWithRelations para o tipo de retorno completo
   */
  findByMemberEstablishmentServiceWithRelations(
    memberId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<MemberServiceWithRelations | null>;

  existsByMemberEstablishmentService(
    memberId: string,
    establishmentId: string,
    serviceId: string,
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
    data: (UserService & { service: EstablishmentService })[];
    total: number;
  }>;

  updateMemberService(
    id: string,
    data: {
      price?: number;
      commission?: number;
      duration?: number;
    },
  ): Promise<UserService>;

  deleteMemberService(id: string, deletedBy: string): Promise<void>;

  findOneByMemberService(
    memberId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<(UserService & { service: EstablishmentService }) | null>;
}
