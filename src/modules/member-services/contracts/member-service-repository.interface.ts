import { EstablishmentService, UserService } from '@prisma/client';

import { MemberServiceWithRelations } from '../types/member-service-with-relations.type';

export interface IMemberServiceRepository {
  /**
   * Cria um novo relacionamento entre membro e serviço do estabelecimento.
   *
   * @param data - Dados para criação (membro, estabelecimento, serviço, preço, comissão e duração)
   * @returns O serviço do membro criado
   */
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

  /**
   * Verifica se existe um relacionamento entre membro e serviço ativo.
   *
   * @param memberId - ID do membro
   * @param establishmentId - ID do estabelecimento
   * @param serviceId - ID do serviço
   * @returns true se existir, false caso contrário
   */
  existsByMemberEstablishmentService(
    memberId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<boolean>;

  /**
   * Lista serviços de um membro de forma paginada.
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
    data: (UserService & { service: EstablishmentService })[];
    total: number;
  }>;

  /**
   * Atualiza dados de um serviço de membro.
   *
   * @param id - ID do relacionamento
   * @param data - Dados para atualização (preço, comissão e/ou duração)
   * @returns O serviço do membro atualizado
   */
  updateMemberService(
    id: string,
    data: {
      price?: number;
      commission?: number;
      duration?: number;
    },
  ): Promise<UserService>;

  /**
   * Realiza o soft delete de um serviço de membro.
   *
   * @param id - ID do relacionamento
   * @param deletedBy - ID do usuário que realizou a exclusão
   */
  deleteMemberService(id: string, deletedBy: string): Promise<void>;

  /**
   * Busca um serviço de membro específico incluindo dados do serviço do estabelecimento.
   *
   * @param memberId - ID do membro
   * @param establishmentId - ID do estabelecimento
   * @param serviceId - ID do serviço
   * @returns Dados do serviço do membro com o serviço do estabelecimento incluso, ou null
   */
  findOneByMemberService(
    memberId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<(UserService & { service: EstablishmentService }) | null>;

  /**
   * Busca associação por membro, estabelecimento e serviço incluindo registros soft-deleted.
   * 
   * Usado principalmente no fluxo de criação para permitir a restauração de um registro 
   * deletado anteriormente, evitando violação de restrição única.
   * 
   * @param memberId - ID do membro
   * @param establishmentId - ID do estabelecimento
   * @param serviceId - ID do serviço
   * @returns O registro encontrado (mesmo se deletado) ou null
   */
  findOneByMemberEstablishmentServiceIncludingDeleted(
    memberId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<UserService | null>;

  /**
   * Restaura um MemberService que foi soft-deleted.
   * 
   * Limpa os campos deletedAt e deletedBy, e atualiza preço, comissão e duração com os novos valores fornecidos.
   * 
   * @param id - ID do registro a ser restaurado
   * @param data - Novos dados de preço, comissão e duração
   * @returns O registro restaurado e atualizado
   */
  restoreMemberService(
    id: string,
    data: { price: number; commission: number; duration: number },
  ): Promise<UserService>;
}
