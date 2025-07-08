import { HttpStatus, Injectable } from '@nestjs/common';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

@Injectable()
export class EstablishmentAccessService {
  constructor(
    private readonly establishmentRepository: EstablishmentRepository,

    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Throws if the user does not have access to the establishment as ADMIN.
   * @param establishmentId string
   * @param userId string
   * @returns establishment entity if found and user is ADMIN
   */
  async assertUserHasAccess(establishmentId: string, userId: string) {
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
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    // 2. Verifica se o usuário é membro
    const member = establishment.members.find((m) => m.userId === userId);
    if (!member) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: userId },
      );
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    // 3. Verifica se o usuário é ADMIN
    if (member.role !== 'ADMIN') {
      const message = this.errorMessageService.getMessage(
        ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: userId },
      );
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT,
      );
    }

    return establishment;
  }
}
