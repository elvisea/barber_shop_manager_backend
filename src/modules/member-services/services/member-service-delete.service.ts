import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceDeleteParamDTO } from '../dtos/member-service-delete-param.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { MemberServiceValidationService } from './member-service-validation.service';

import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Faz soft delete de uma associação member-service. Apenas o dono do estabelecimento pode deletar.
 * Resolve a necessidade de remover a atribuição de um serviço a um membro sem perder o histórico.
 */
@Injectable()
export class MemberServiceDeleteService {
  private readonly logger = new Logger(MemberServiceDeleteService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly memberServiceValidationService: MemberServiceValidationService,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Faz soft delete do member-service. Não faz nada se já estiver deletado.
   *
   * @param params - Parâmetros da rota (memberId, serviceId)
   * @param requesterId - ID do usuário que faz a requisição (deve ser dono do estabelecimento)
   * @throws CustomHttpException quando a validação falha (não encontrado, não é dono, etc.)
   */
  async execute(
    params: MemberServiceDeleteParamDTO,
    requesterId: string,
  ): Promise<void> {
    // 1. Obtém establishmentId (valida que o requester é dono e que o member pertence ao estabelecimento)
    const establishmentId =
      await this.userEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember(
        params.memberId,
        requesterId,
      );

    this.logger.log(
      `Deleting member service for member ${params.memberId} in establishment ${establishmentId} and service ${params.serviceId}`,
    );

    // 2. Valida e busca o MemberService existente com relacionamentos
    const memberServiceWithRelations =
      await this.memberServiceValidationService.execute(
        params.memberId,
        establishmentId,
        params.serviceId,
        requesterId,
      );

    // 3. Faz soft delete do MemberService
    await this.memberServiceRepository.deleteMemberService(
      memberServiceWithRelations.id,
      requesterId,
    );

    this.logger.log(
      `MemberService deleted with ID: ${memberServiceWithRelations.id}`,
    );
  }
}
