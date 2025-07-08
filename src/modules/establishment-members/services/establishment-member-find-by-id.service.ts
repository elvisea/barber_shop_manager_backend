import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentMemberFindByIdResponseDTO } from '../dtos/establishment-member-find-by-id-response.dto';
import { EstablishmentMemberMapper } from '../mappers/establishment-member.mapper';
import { EstablishmentMemberRepository } from '../repositories/establishment-member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class EstablishmentMemberFindByIdService {
  private readonly logger = new Logger(EstablishmentMemberFindByIdService.name);

  constructor(
    private readonly establishmentMemberRepository: EstablishmentMemberRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) {}

  async execute(
    requesterId: string,
    userId: string,
    establishmentId: string,
  ): Promise<EstablishmentMemberFindByIdResponseDTO> {
    // Valida se o requester tem permissão no estabelecimento
    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      requesterId,
    );

    const member =
      await this.establishmentMemberRepository.findByUserAndEstablishment(
        userId,
        establishmentId,
      );

    if (!member) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: userId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    return EstablishmentMemberMapper.toFindByIdResponse(member);
  }
}
