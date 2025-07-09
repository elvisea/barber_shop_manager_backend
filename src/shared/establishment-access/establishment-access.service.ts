import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

@Injectable()
export class EstablishmentAccessService {
  private readonly logger = new Logger(EstablishmentAccessService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,

    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Throws if the user does not have access to the establishment as ADMIN.
   * @param establishmentId string
   * @param requesterId string
   * @returns establishment entity if found and user is ADMIN
   */
  async assertUserHasAccess(establishmentId: string, requesterId: string) {
    this.logger.log(
      `Checking access for user ${requesterId} to establishment ${establishmentId}`,
    );

    // 1. Verifica se o estabelecimento existe
    const establishment =
      await this.establishmentRepository.findByIdWithMembersAdmin(
        establishmentId,
      );

    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(
        `Establishment not found: ${establishmentId} | User: ${requesterId}`,
      );

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    // 2. Verifica se o requisitante é membro
    const member = establishment.members.find((m) => m.userId === requesterId);

    if (!member) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.USER_NOT_MEMBER_OF_ESTABLISHMENT,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: requesterId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.USER_NOT_MEMBER_OF_ESTABLISHMENT,
      );
    }

    // 3. Verifica se o requisitante é ADMIN
    if (member.role !== Role.ADMIN) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: requesterId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT,
      );
    }

    this.logger.log(
      `Access granted for user ${requesterId} to establishment ${establishmentId}`,
    );
    return establishment;
  }
}
