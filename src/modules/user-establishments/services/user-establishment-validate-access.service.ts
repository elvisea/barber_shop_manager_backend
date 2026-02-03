import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { UserEstablishmentRepository } from '../repositories/user-establishment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

/**
 * Serviço que valida se um usuário tem permissão para acessar um estabelecimento.
 *
 * Considera acesso válido quando o usuário é:
 * - Dono do estabelecimento (Establishment.ownerId), ou
 * - Membro ativo (UserEstablishment com isActive = true).
 *
 * Usado em fluxos onde já se tem userId e establishmentId (ex.: listar clientes do estabelecimento).
 */
@Injectable()
export class UserEstablishmentValidateAccessService {
  private readonly logger = new Logger(
    UserEstablishmentValidateAccessService.name,
  );

  constructor(
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Valida se o usuário tem acesso ao estabelecimento.
   * Não retorna valor; lança exceção se não tiver acesso.
   *
   * @param userId - ID do usuário a validar
   * @param establishmentId - ID do estabelecimento
   * @throws CustomHttpException se o usuário não for dono nem membro ativo
   */
  async execute(userId: string, establishmentId: string): Promise<void> {
    this.logger.debug(
      `Validating user ${userId} access to establishment ${establishmentId}`,
    );

    // 1. Busca em paralelo: vínculo user-establishment e o estabelecimento
    const [userEstablishment, establishment] = await Promise.all([
      this.userEstablishmentRepository.findByUserAndEstablishment(
        userId,
        establishmentId,
      ),
      this.establishmentRepository.findById(establishmentId),
    ]);

    // 2. Se o usuário é dono do estabelecimento, acesso permitido
    if (establishment && establishment.ownerId === userId) {
      return;
    }

    // 3. Se o usuário é membro ativo do estabelecimento, acesso permitido
    if (userEstablishment && userEstablishment.isActive) {
      return;
    }

    // 4. Caso contrário, monta mensagem e lança FORBIDDEN
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
}
