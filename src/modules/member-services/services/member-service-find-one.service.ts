import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceFindOneParamDTO } from '../dtos/member-service-find-one-param.dto';
import { MemberServiceFindOneResponseDTO } from '../dtos/member-service-find-one-response.dto';

import { MemberServiceValidationService } from './member-service-validation.service';

import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Busca um member-service por membro e serviço. O requester deve ser o dono do estabelecimento.
 * Resolve a necessidade de exibir ou editar uma atribuição de serviço (preço, duração, comissão) para um membro.
 */
@Injectable()
export class MemberServiceFindOneService {
  private readonly logger = new Logger(MemberServiceFindOneService.name);

  constructor(
    private readonly memberServiceValidationService: MemberServiceValidationService,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Retorna o member-service com todos os detalhes (nome do serviço, descrição, duração, preço, comissão).
   *
   * @param params - Parâmetros da rota (memberId, serviceId)
   * @param requesterId - ID do usuário que faz a requisição (deve ser dono do estabelecimento)
   * @returns {@link MemberServiceFindOneResponseDTO} com os dados do member-service
   * @throws CustomHttpException quando a validação falha (não encontrado, não é dono, etc.)
   */
  async execute(
    params: MemberServiceFindOneParamDTO,
    requesterId: string,
  ): Promise<MemberServiceFindOneResponseDTO> {
    // 1. Obtém establishmentId (valida que o requester é dono e que o member pertence ao estabelecimento)
    const establishmentId =
      await this.userEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember(
        params.memberId,
        requesterId,
      );

    this.logger.log(
      `Finding member service for member ${params.memberId} in establishment ${establishmentId} and service ${params.serviceId}`,
    );

    // 2. Valida e busca o MemberService existente com relacionamentos
    const memberServiceWithRelations =
      await this.memberServiceValidationService.execute(
        params.memberId,
        establishmentId,
        params.serviceId,
        requesterId,
      );

    this.logger.log(`MemberService found: ${memberServiceWithRelations.id}`);

    // 3. Retorna o DTO de resposta
    return {
      id: memberServiceWithRelations.service.id, // Retorna serviceId para consistência com find-all
      name: memberServiceWithRelations.service.name,
      description: memberServiceWithRelations.service.description,
      duration: memberServiceWithRelations.duration,
      price: memberServiceWithRelations.price,
      commission: Number(memberServiceWithRelations.commission),
      createdAt: memberServiceWithRelations.createdAt,
      updatedAt: memberServiceWithRelations.updatedAt,
    };
  }
}
