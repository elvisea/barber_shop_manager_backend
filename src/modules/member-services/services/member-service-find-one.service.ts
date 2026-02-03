import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceFindOneParamDTO } from '../dtos/member-service-find-one-param.dto';
import { MemberServiceFindOneResponseDTO } from '../dtos/member-service-find-one-response.dto';

import { MemberServiceValidationService } from './member-service-validation.service';

import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Fetches a single member-service by member and service. Requester must be establishment owner.
 * Resolves the need to display or edit one service assignment (price, duration, commission) for a member.
 */
@Injectable()
export class MemberServiceFindOneService {
  private readonly logger = new Logger(MemberServiceFindOneService.name);

  constructor(
    private readonly memberServiceValidationService: MemberServiceValidationService,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Returns the member-service with full details (service name, description, duration, price, commission).
   *
   * @param params - Route params (memberId, serviceId)
   * @param requesterId - ID of the user performing the request (must be establishment owner)
   * @returns {@link MemberServiceFindOneResponseDTO} with member-service data
   * @throws CustomHttpException when validation fails (not found, not owner, etc.)
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
