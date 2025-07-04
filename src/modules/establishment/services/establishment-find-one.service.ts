import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentMemberRepository } from '../../establishment-members/repositories/establishment-member.repository';
import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentFindOneService {
  private readonly logger = new Logger(EstablishmentFindOneService.name);

  constructor(
    private readonly establishmentMemberRepository: EstablishmentMemberRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentFindOneResponseDTO> {
    this.logger.log(
      `Finding establishment with ID ${establishmentId} for userId=${userId}`,
    );

    // Validar se o usuário é membro do estabelecimento e tem permissão ADMIN
    const establishmentMember =
      await this.establishmentMemberRepository.findEstablishmentByIdAndAdmin(
        establishmentId,
        userId,
      );

    if (!establishmentMember) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        {
          USER_ID: userId,
          ESTABLISHMENT_ID: establishmentId,
        },
      );

      this.logger.warn(errorMessage);

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    const establishment = establishmentMember.establishment;

    return establishment;
  }
}
