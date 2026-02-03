import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceDeleteParamDTO } from '../dtos/member-service-delete-param.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { MemberServiceValidationService } from './member-service-validation.service';

import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Soft-deletes a member-service association. Only the establishment owner can delete.
 * Resolves the need to remove a service assignment from a member without losing history.
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
   * Soft-deletes the member-service. No-op if already deleted.
   *
   * @param params - Route params (memberId, serviceId)
   * @param requesterId - ID of the user performing the request (must be establishment owner)
   * @throws CustomHttpException when validation fails (not found, not owner, etc.)
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
