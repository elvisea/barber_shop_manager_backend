import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

/**
 * Valida se o usuário tem acesso ao estabelecimento (owner ou member).
 * Usado pelas rotas /me/products, /me/services, /me/customers, /me/members.
 * Uma única query ao banco (establishment + userEstablishment do usuário via join).
 */
@Injectable()
export class MeEstablishmentAccessService {
  private readonly logger = new Logger(MeEstablishmentAccessService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async assertUserHasAccessToEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<void> {
    const establishment =
      await this.establishmentRepository.findByIdWithUserAccess(
        establishmentId,
        userId,
      );

    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    const isOwner = establishment.ownerId === userId;
    const activeMember = establishment.userEstablishments[0]?.isActive === true;

    if (isOwner || activeMember) {
      return;
    }

    const message = this.errorMessageService.getMessage(
      ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      { ESTABLISHMENT_ID: establishmentId, USER_ID: userId },
    );
    this.logger.warn(message);
    throw new CustomHttpException(
      message,
      HttpStatus.FORBIDDEN,
      ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
    );
  }
}
