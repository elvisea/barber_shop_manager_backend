import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';
import { MemberServiceUpdateParamDTO } from '../dtos/member-service-update-param.dto';
import { MemberServiceUpdateRequestDTO } from '../dtos/member-service-update-request.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { MemberServiceValidationService } from './member-service-validation.service';

import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Updates price, duration and commission of an existing member-service. Only establishment owner can update.
 * Resolves the need to change per-member service pricing and commission without removing the association.
 */
@Injectable()
export class MemberServiceUpdateService {
  private readonly logger = new Logger(MemberServiceUpdateService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly memberServiceValidationService: MemberServiceValidationService,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Updates the member-service with new price, duration and commission.
   *
   * @param dto - New price, duration and commission
   * @param params - Route params (memberId, serviceId)
   * @param requesterId - ID of the user performing the request (must be establishment owner)
   * @returns Updated member-service as {@link MemberServiceCreateResponseDTO}
   * @throws CustomHttpException when validation fails (not found, not owner, etc.)
   */
  async execute(
    dto: MemberServiceUpdateRequestDTO,
    params: MemberServiceUpdateParamDTO,
    requesterId: string,
  ): Promise<MemberServiceCreateResponseDTO> {
    // 1. Obtém establishmentId (valida que o requester é dono e que o member pertence ao estabelecimento)
    const establishmentId =
      await this.userEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember(
        params.memberId,
        requesterId,
      );

    this.logger.log(
      `Updating member service for member ${params.memberId} in establishment ${establishmentId} and service ${params.serviceId}`,
    );

    // 2. Valida e busca o MemberService existente com relacionamentos
    const memberServiceWithRelations =
      await this.memberServiceValidationService.execute(
        params.memberId,
        establishmentId,
        params.serviceId,
        requesterId,
      );

    // 3. Atualiza o MemberService
    const updatedMemberService =
      await this.memberServiceRepository.updateMemberService(
        memberServiceWithRelations.id,
        {
          price: dto.price,
          commission: dto.commission,
          duration: dto.duration,
        },
      );

    this.logger.log(
      `MemberService updated with ID: ${updatedMemberService.id}`,
    );

    // 4. Retorna o DTO de resposta
    return {
      id: updatedMemberService.id,
      memberId: updatedMemberService.userId,
      establishmentId: updatedMemberService.establishmentId,
      serviceId: updatedMemberService.serviceId,
      price: updatedMemberService.price,
      duration: updatedMemberService.duration,
      commission: Number(updatedMemberService.commission),
      createdAt: updatedMemberService.createdAt,
      updatedAt: updatedMemberService.updatedAt,
    };
  }
}
