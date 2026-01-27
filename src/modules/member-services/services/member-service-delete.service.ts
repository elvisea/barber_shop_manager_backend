import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceDeleteParamDTO } from '../dtos/member-service-delete-param.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { MemberServiceValidationService } from './member-service-validation.service';

/**
 * Service responsável por deletar um MemberService.
 */
@Injectable()
export class MemberServiceDeleteService {
  private readonly logger = new Logger(MemberServiceDeleteService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly memberServiceValidationService: MemberServiceValidationService,
  ) {}

  /**
   * Deleta um MemberService existente (soft delete).
   *
   * @param params - Parâmetros da rota (memberId, establishmentId, serviceId)
   * @param requesterId - ID do usuário que está fazendo a requisição
   * @throws CustomHttpException se alguma validação falhar
   */
  async execute(
    params: MemberServiceDeleteParamDTO,
    requesterId: string,
  ): Promise<void> {
    this.logger.log(
      `Deleting member service for member ${params.memberId} in establishment ${params.establishmentId} and service ${params.serviceId}`,
    );

    // Validações centralizadas em uma única chamada
    const memberServiceWithRelations =
      await this.memberServiceValidationService.execute(
        params.memberId,
        params.establishmentId,
        params.serviceId,
        requesterId,
      );

    // Faz soft delete do MemberService
    await this.memberServiceRepository.deleteMemberService(
      memberServiceWithRelations.id,
      requesterId,
    );

    this.logger.log(
      `MemberService deleted with ID: ${memberServiceWithRelations.id}`,
    );
  }
}
