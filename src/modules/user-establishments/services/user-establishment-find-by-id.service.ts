import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberResponseDTO } from '../../members/dtos';
import { MemberMapper } from '../../members/mappers';
import { UserEstablishmentRepository } from '../repositories/user-establishment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserRepository } from '@/modules/user/repositories/user.repository';

@Injectable()
export class UserEstablishmentFindByIdService {
  private readonly logger = new Logger(UserEstablishmentFindByIdService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    userId: string,
    requesterId: string,
  ): Promise<MemberResponseDTO> {
    this.logger.log(`Finding user ${userId} by user ${requesterId}`);

    const user = await this.userRepository.findById(userId);

    if (!user) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        { MEMBER_ID: userId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_NOT_FOUND,
      );
    }

    const userEstablishments =
      await this.userEstablishmentRepository.findAllByUserWithRelations(userId);

    if (userEstablishments.length === 0) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { USER_ID: userId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    const hasAccess = userEstablishments.some(
      (ue) => ue.establishment.ownerId === requesterId,
    );

    if (!hasAccess) {
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

    this.logger.log(`User found: ${user.id}`);

    return MemberMapper.toResponseDTO(user, true);
  }
}
