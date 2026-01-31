import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';
import { EstablishmentAccessResult } from '../types/establishment-access-result.type';
import { IEstablishmentAccessService } from '../contracts/establishment-access-service.interface';

/**
 * Single source of truth for the rule "user can access establishment (owner or active member)".
 * Used by the Me module (/me/* routes) and by the Appointments module for permission checks.
 * Any change to this rule must be made here so all consumers stay consistent.
 */
@Injectable()
export class EstablishmentAccessService implements IEstablishmentAccessService {
  private readonly logger = new Logger(EstablishmentAccessService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Asserts that the user can access the establishment (owner or active member).
   * Use this when the caller only needs a yes/no answer (e.g. /me/* routes).
   * @throws CustomHttpException when establishment is not found or user has no access
   */
  async assertUserCanAccessEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<void> {
    await this.getEstablishmentAccess(userId, establishmentId);
  }

  /**
   * Returns establishment access details (establishment, isOwner, userEstablishment.role).
   * Use this when the caller needs role/isOwner for further permission logic (e.g. appointment permissions).
   * @throws CustomHttpException when establishment is not found or user has no access
   */
  async getEstablishmentAccess(
    userId: string,
    establishmentId: string,
  ): Promise<EstablishmentAccessResult> {
    const result = await this.establishmentRepository.findByIdWithUserAccess(
      establishmentId,
      userId,
    );

    if (!result) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId },
      );
      this.logger.warn(`Establishment not found: ${establishmentId}`);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    const establishment = result;
    const userEstablishments = result.userEstablishments;

    if (establishment.ownerId === userId) {
      this.logger.log(
        `User ${userId} is owner of establishment ${establishmentId}`,
      );
      return { establishment, isOwner: true };
    }

    const member = userEstablishments[0];
    if (!member || !member.isActive) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: userId },
      );
      this.logger.warn(
        `User ${userId} is not owner or active member of establishment ${establishmentId}`,
      );
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    this.logger.log(
      `User ${userId} is member of establishment ${establishmentId}, role=${member.role}`,
    );
    return {
      establishment,
      isOwner: false,
      userEstablishment: {
        id: member.id,
        isActive: member.isActive,
        role: member.role,
      },
    };
  }
}
