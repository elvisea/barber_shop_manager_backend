import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { UserEstablishmentRepository } from '../repositories/user-establishment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { handleServiceError } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserRepository } from '@/modules/user/repositories/user.repository';

@Injectable()
export class UserEstablishmentDeleteService {
  private readonly logger = new Logger(UserEstablishmentDeleteService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(userId: string, requesterId: string): Promise<void> {
    this.logger.log(`Deleting user ${userId} by user ${requesterId}`);

    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser) {
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
        {
          USER_ID: userId,
          ESTABLISHMENT_ID: 'unknown',
        },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    const isOwner = userEstablishments.some(
      (ue) => ue.establishment.ownerId === requesterId,
    );

    if (!isOwner) {
      const establishmentId = userEstablishments[0].establishment.id;
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

    try {
      await this.userRepository.deleteUser(userId);

      this.logger.log(`User deleted: ${userId}`);
    } catch (error: unknown) {
      handleServiceError({
        error,
        logger: this.logger,
        errorMessageService: this.errorMessageService,
        errorCode: ErrorCode.MEMBER_DELETE_FAILED,
        httpStatus: HttpStatus.BAD_REQUEST,
        logMessage: 'Failed to delete user',
        logContext: {
          userId,
        },
        errorParams: {
          MEMBER_ID: userId,
        },
      });
    }
  }
}
