import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentMemberUpdateRequestDTO } from '../dtos/establishment-member-update-request.dto';
import { EstablishmentMemberUpdateResponseDTO } from '../dtos/establishment-member-update-response.dto';
import { EstablishmentMemberMapper } from '../mappers/establishment-member.mapper';
import { EstablishmentMemberRepository } from '../repositories/establishment-member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class EstablishmentMemberUpdateService {
  private readonly logger = new Logger(EstablishmentMemberUpdateService.name);

  constructor(
    private readonly establishmentMemberRepository: EstablishmentMemberRepository,
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    establishmentId: string,
    memberId: string,
    requesterId: string,
    dto: EstablishmentMemberUpdateRequestDTO,
  ): Promise<EstablishmentMemberUpdateResponseDTO> {
    this.logger.log(
      `Updating member ${memberId} in establishment ${establishmentId} by requester ${requesterId}`,
    );

    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      requesterId,
    );

    const member =
      await this.establishmentMemberRepository.findByUserAndEstablishment(
        memberId,
        establishmentId,
      );

    if (!member) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: memberId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND,
      );
    }

    const updated = await this.establishmentMemberRepository.updateMember(
      memberId,
      establishmentId,
      dto,
    );

    this.logger.log(
      `Member ${memberId} updated in establishment ${establishmentId}`,
    );

    return EstablishmentMemberMapper.toFindByIdResponse(updated);
  }
}
