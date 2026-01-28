import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { MemberCreateRequestDTO, MemberResponseDTO } from '../../members/dtos';
import { MemberMapper } from '../../members/mappers';
import { UserEstablishmentRepository } from '../repositories/user-establishment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { handleServiceError } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { MemberCreatedEvent } from '@/modules/emails/events/member-created.event';
import { MemberVerificationTokenSentEvent } from '@/modules/emails/events/member-verification-token-sent.event';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';
import { EmailVerificationTokenService } from '@/modules/tokens/services/email-verification-token.service';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { generateTempPassword } from '@/utils/generate-temp-password';
import { hashValue } from '@/utils/hash-value';

@Injectable()
export class UserEstablishmentCreateService {
  private readonly logger = new Logger(UserEstablishmentCreateService.name);

  private static readonly EMAIL_VERIFICATION_EXPIRATION_MINUTES = 15;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly emailVerificationTokenService: EmailVerificationTokenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    dto: MemberCreateRequestDTO,
    establishmentId: string,
    requesterId: string,
  ): Promise<MemberResponseDTO> {
    this.logger.log(
      `Creating user for establishment ${establishmentId} by user ${requesterId}`,
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

    const emailExists = await this.userRepository.existsByEmail(dto.email);

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

    const phoneExists = await this.userRepository.existsByPhone(dto.phone);

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

    const tempPassword = generateTempPassword(8);
    const hashedPassword = await hashValue(tempPassword);

    try {
      const user = await this.userRepository.createUserForEstablishment({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: dto.role,
        document: '',
      });

      await this.userEstablishmentRepository.create({
        userId: user.id,
        establishmentId,
        role: dto.role,
      });

      this.logger.log(`User created with ID: ${user.id}`);

      const memberCreatedEvent = new MemberCreatedEvent({
        memberId: user.id,
        email: user.email,
        name: user.name,
        tempPassword,
      });
      this.eventEmitter.emit('member.created', memberCreatedEvent);

      try {
        const { token, tokenRecord } =
          await this.emailVerificationTokenService.createEmailVerificationToken(
            user.id,
            UserEstablishmentCreateService.EMAIL_VERIFICATION_EXPIRATION_MINUTES,
          );

        const expiresAtFormatted = tokenRecord.expiresAt.toLocaleString(
          'pt-BR',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo',
          },
        );

        const verificationTokenSentEvent = new MemberVerificationTokenSentEvent(
          {
            memberId: user.id,
            email: user.email,
            name: user.name,
            token,
            expiresAt: expiresAtFormatted,
            tempPassword,
          },
        );
        this.eventEmitter.emit(
          'member.verification.token.sent',
          verificationTokenSentEvent,
        );

        this.logger.log(
          `Verification token event emitted for user: ${user.id}`,
        );
      } catch (emailError: unknown) {
        this.logger.error(`Failed to create verification for user ${user.id}`, {
          error:
            emailError instanceof Error
              ? emailError.message
              : String(emailError),
        });
      }

      return MemberMapper.toResponseDTO(user, false);
    } catch (error: unknown) {
      handleServiceError({
        error,
        logger: this.logger,
        errorMessageService: this.errorMessageService,
        errorCode: ErrorCode.MEMBER_CREATION_FAILED,
        httpStatus: HttpStatus.BAD_REQUEST,
        logMessage: 'Failed to create user',
        logContext: {
          email: dto.email,
          establishmentId,
        },
        errorParams: {
          EMAIL: dto.email,
          ESTABLISHMENT_ID: establishmentId,
        },
      });
    }
  }
}
