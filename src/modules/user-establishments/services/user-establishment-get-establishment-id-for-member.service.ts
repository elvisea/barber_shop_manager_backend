import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { UserEstablishmentRepository } from '../repositories/user-establishment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

/**
 * Serviço que obtém o ID do estabelecimento em que o requester é dono e o membro pertence.
 *
 * Usado quando você tem apenas memberId e requesterId (ex.: member-services, member-products)
 * e precisa do establishmentId para operações subsequentes.
 *
 * @throws CustomHttpException se o membro não pertence a nenhum estabelecimento
 * @throws CustomHttpException se o requester não é dono de nenhum estabelecimento onde o membro está
 */
@Injectable()
export class UserEstablishmentGetEstablishmentIdForMemberService {
  private readonly logger = new Logger(
    UserEstablishmentGetEstablishmentIdForMemberService.name,
  );

  constructor(
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Retorna o establishmentId do estabelecimento que o requester é dono e onde o membro pertence.
   *
   * @param memberId - ID do usuário (membro) que pertence ao estabelecimento
   * @param requesterId - ID do usuário que faz a requisição (deve ser owner do estabelecimento)
   * @returns ID do estabelecimento
   */
  async execute(memberId: string, requesterId: string): Promise<string> {
    // 1. Busca todos os estabelecimentos em que o membro participa (com relação establishment)
    const userEstablishments =
      await this.userEstablishmentRepository.findAllByUserWithRelations(
        memberId,
      );

    // 2. Se o membro não está em nenhum estabelecimento, lança NOT_FOUND
    if (userEstablishments.length === 0) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { USER_ID: memberId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    // 3. Encontra o estabelecimento cujo dono é o requester
    const ownedByRequester = userEstablishments.find(
      (ue) => ue.establishment.ownerId === requesterId,
    );

    // 4. Se o requester não é dono de nenhum deles, lança FORBIDDEN
    if (!ownedByRequester) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { USER_ID: requesterId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    // 5. Retorna o ID do estabelecimento encontrado
    return (
      ownedByRequester.establishment?.id ?? ownedByRequester.establishmentId
    );
  }
}
