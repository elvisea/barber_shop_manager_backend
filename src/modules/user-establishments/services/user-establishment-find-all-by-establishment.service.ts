import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import {
  MemberFindAllQueryDTO,
  MemberPaginatedResponseDTO,
} from '../../members/dtos';
import { MemberMapper } from '../../members/mappers';
import { UserEstablishmentRepository } from '../repositories/user-establishment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

@Injectable()
export class UserEstablishmentFindAllByEstablishmentService {
  private readonly logger = new Logger(
    UserEstablishmentFindAllByEstablishmentService.name,
  );

  constructor(
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    establishmentId: string,
    requesterId: string,
    query: MemberFindAllQueryDTO,
  ): Promise<MemberPaginatedResponseDTO> {
    this.logger.log(
      `Finding all users for establishment ${establishmentId} by user ${requesterId}`,
    );

    const establishment =
      await this.establishmentRepository.findById(establishmentId);

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

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const { data, total } =
      await this.userEstablishmentRepository.findAllByEstablishmentPaginated({
        establishmentId,
        skip,
        take: limit,
      });

    const users = data.map((ue) => ue.user);
    const members = MemberMapper.toResponseDTOArray(users, false);

    this.logger.log(`Found ${members.length} users out of ${total} total`);

    return new MemberPaginatedResponseDTO(members, page, limit, total);
  }
}
