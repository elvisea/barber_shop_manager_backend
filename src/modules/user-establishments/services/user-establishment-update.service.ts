import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { MemberResponseDTO, MemberUpdateRequestDTO } from '../../members/dtos';
import { MemberMapper } from '../../members/mappers';
import { UserEstablishmentRepository } from '../repositories/user-establishment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { handleServiceError } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserRepository } from '@/modules/user/repositories/user.repository';

@Injectable()
export class UserEstablishmentUpdateService {
  private readonly logger = new Logger(UserEstablishmentUpdateService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    userId: string,
    dto: MemberUpdateRequestDTO,
    requesterId: string,
  ): Promise<MemberResponseDTO> {
    this.logger.log(`Updating user ${userId} by user ${requesterId}`);

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

    if (dto.email && dto.email !== existingUser.email) {
      const emailExists = await this.userRepository.existsByEmailExcludingId(
        dto.email,
        userId,
      );

      if (emailExists) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS,
          { EMAIL: dto.email },
        );

        this.logger.warn(message);

        throw new CustomHttpException(
          message,
          HttpStatus.CONFLICT,
          ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS,
        );
      }
    }

    if (dto.phone && dto.phone !== existingUser.phone) {
      const phoneExists = await this.userRepository.existsByPhoneExcludingId(
        dto.phone,
        userId,
      );

      if (phoneExists) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.MEMBER_PHONE_ALREADY_EXISTS,
          { PHONE: dto.phone },
        );

        this.logger.warn(message);

        throw new CustomHttpException(
          message,
          HttpStatus.CONFLICT,
          ErrorCode.MEMBER_PHONE_ALREADY_EXISTS,
        );
      }
    }

    try {
      const updateData: Partial<{
        name: string;
        email: string;
        phone: string;
        role: UserRole;
      }> = {};

      if (dto.name) updateData.name = dto.name;
      if (dto.email) updateData.email = dto.email;
      if (dto.phone) updateData.phone = dto.phone;
      if (dto.role) updateData.role = dto.role;

      const user = await this.userRepository.updateUserFields(
        userId,
        updateData,
      );

      if (dto.isActive !== undefined && userEstablishments.length > 0) {
        const firstUserEstablishment = userEstablishments[0];
        await this.userEstablishmentRepository.update(
          firstUserEstablishment.id,
          {
            isActive: dto.isActive,
          },
        );
      }

      this.logger.log(`User updated: ${user.id}`);

      return MemberMapper.toResponseDTO(user, false);
    } catch (error: unknown) {
      handleServiceError({
        error,
        logger: this.logger,
        errorMessageService: this.errorMessageService,
        errorCode: ErrorCode.MEMBER_UPDATE_FAILED,
        httpStatus: HttpStatus.BAD_REQUEST,
        logMessage: 'Failed to update user',
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
