import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Establishment, User } from '@prisma/client';

import { UserEstablishmentRepository } from '../repositories/user-establishment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

@Injectable()
export class UserEstablishmentValidationService {
  private readonly logger = new Logger(UserEstablishmentValidationService.name);

  constructor(
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Valida se o usuário tem acesso ao estabelecimento (owner ou member ativo).
   * Permite: dono do estabelecimento (Establishment.ownerId) ou membro ativo (UserEstablishment).
   */
  async validateUserAccessToEstablishment(
    userId: string,
    establishmentId: string,
  ) {
    this.logger.debug(
      `Validating user ${userId} access to establishment ${establishmentId}`,
    );

    const [userEstablishment, establishment] = await Promise.all([
      this.userEstablishmentRepository.findByUserAndEstablishment(
        userId,
        establishmentId,
      ),
      this.establishmentRepository.findById(establishmentId),
    ]);

    if (establishment && establishment.ownerId === userId) {
      return;
    }

    if (userEstablishment && userEstablishment.isActive) {
      return;
    }

    const message = this.errorMessageService.getMessage(
      ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      {
        ESTABLISHMENT_ID: establishmentId,
        USER_ID: userId,
      },
    );

    this.logger.warn(message);

    throw new CustomHttpException(
      message,
      HttpStatus.FORBIDDEN,
      ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
    );
  }

  /**
   * Valida User e Establishment, retornando ambos validados.
   *
   * Realiza todas as validações necessárias para garantir que:
   * - O User existe no Establishment
   * - O Establishment existe
   * - O requester é dono do Establishment
   *
   * @param userId - ID do usuário
   * @param establishmentId - ID do estabelecimento
   * @param requesterId - ID do usuário que está fazendo a requisição
   * @returns Objeto com establishment e user validados
   * @throws CustomHttpException se alguma validação falhar
   */
  async validateUserAndEstablishment(
    userId: string,
    establishmentId: string,
    requesterId: string,
  ): Promise<{ establishment: Establishment; member: User }> {
    const userEstablishment =
      await this.userEstablishmentRepository.findByUserAndEstablishmentWithRelations(
        userId,
        establishmentId,
      );

    if (!userEstablishment || !userEstablishment.isActive) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        {
          USER_ID: userId,
          ESTABLISHMENT_ID: establishmentId,
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    const establishment = userEstablishment.establishment;

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

    if (establishment.ownerId !== requesterId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: requesterId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    return {
      establishment,
      member: userEstablishment.user,
    };
  }
}
