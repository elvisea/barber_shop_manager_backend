import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Establishment, User } from '@prisma/client';

import { UserEstablishmentRepository } from '../repositories/user-establishment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

/**
 * Serviço que valida que o requester é dono do estabelecimento e que o membro (userId) pertence a ele.
 *
 * Usado ao atribuir serviços/produtos a funcionários: apenas o dono do estabelecimento
 * pode realizar essa ação. Retorna o establishment e o member validados para uso no fluxo.
 */
@Injectable()
export class UserEstablishmentValidateOwnerAndMemberService {
  private readonly logger = new Logger(
    UserEstablishmentValidateOwnerAndMemberService.name,
  );

  constructor(
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Valida dono e membro e retorna establishment e member.
   *
   * Ordem das verificações:
   * 1. Estabelecimento existe
   * 2. Requester é o dono do estabelecimento
   * 3. UserId (membro) pertence ao estabelecimento (é o dono ou tem UserEstablishment ativo)
   *
   * @param userId - ID do funcionário (membro ao qual se está atribuindo serviço/produto)
   * @param establishmentId - ID do estabelecimento
   * @param requesterId - ID do usuário que faz a requisição (deve ser o dono)
   * @returns establishment e member validados
   */
  async execute(
    userId: string,
    establishmentId: string,
    requesterId: string,
  ): Promise<{ establishment: Establishment; member: User }> {
    // 1. Busca o estabelecimento com o dono (owner)
    const establishmentWithOwner =
      await this.establishmentRepository.findByIdWithOwner(establishmentId);

    // 2. Se o estabelecimento não existe, lança NOT_FOUND
    if (!establishmentWithOwner) {
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

    // 3. Se o requester não é o dono, lança FORBIDDEN
    if (establishmentWithOwner.ownerId !== requesterId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        {
          ESTABLISHMENT_ID: establishmentId,
          USER_ID: requesterId,
        },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    // 4. Se o userId é o próprio dono, retorna establishment e owner como member
    if (userId === requesterId) {
      return {
        establishment: establishmentWithOwner,
        member: establishmentWithOwner.owner,
      };
    }

    // 5. Busca o vínculo do membro (userId) com o estabelecimento
    const userEstablishment =
      await this.userEstablishmentRepository.findByUserAndEstablishmentWithRelations(
        userId,
        establishmentId,
      );

    // 6. Se não existe vínculo ou membro inativo, lança NOT_FOUND
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

    // 7. Retorna establishment e o user do vínculo como member
    return {
      establishment: establishmentWithOwner,
      member: userEstablishment.user,
    };
  }
}
