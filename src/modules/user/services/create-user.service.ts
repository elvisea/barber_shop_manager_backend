import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { hashValue } from '../../../utils/hash-value';
import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UserRepository } from '../repositories/user.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { handleServiceError } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserCreatedEvent } from '@/modules/emails/events/user-created.event';
import { UserVerificationTokenSentEvent } from '@/modules/emails/events/user-verification-token-sent.event';
import { UserEmailVerificationCreateService } from '@/modules/user-email-verification/services/user-email-verification-create.service';

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(CreateUserService.name);

  /**
   * Tempo de expiração da verificação de email em minutos.
   * 24 horas = 1440 minutos.
   */
  private static readonly EMAIL_VERIFICATION_EXPIRATION_MINUTES = 1440;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly userEmailVerificationCreateService: UserEmailVerificationCreateService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    userData: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    this.logger.log(`Starting user creation with email: ${userData.email}`);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      this.logger.warn(
        `User with email ${userData.email} already exists in the system.`,
      );

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.USER_ALREADY_EXISTS,
        { EMAIL: userData.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.CONFLICT,
        ErrorCode.USER_ALREADY_EXISTS,
      );
    }

    this.logger.log(
      `Email ${userData.email} not found. Proceeding with user creation.`,
    );

    try {
      // Hash the password
      const hashedPassword = await hashValue(userData.password);
      this.logger.log(`User password was hashed successfully.`);

      // Prepare data for creation
      const userDataToCreate = {
        ...userData,
        password: hashedPassword,
      };

      // Create user in database
      const newUser = await this.userRepository.createUser(userDataToCreate);
      this.logger.log(`User with ID ${newUser.id} created successfully.`);

      // Emitir evento de usuário criado
      const userCreatedEvent = new UserCreatedEvent({
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
      });
      this.eventEmitter.emit('user.created', userCreatedEvent);

      // Create email verification
      const emailVerification =
        await this.userEmailVerificationCreateService.execute(
          newUser.id,
          newUser.email,
          CreateUserService.EMAIL_VERIFICATION_EXPIRATION_MINUTES,
        );

      this.logger.log(`Email verification created for user ${newUser.id}`);

      // Formatar data de expiração no formato brasileiro
      const expiresAtFormatted = emailVerification.expiresAt.toLocaleString(
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

      // Emitir evento de token de verificação enviado
      const verificationTokenSentEvent = new UserVerificationTokenSentEvent({
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        token: emailVerification.plainToken,
        expiresAt: expiresAtFormatted,
      });
      this.eventEmitter.emit(
        'user.verification.token.sent',
        verificationTokenSentEvent,
      );

      // Create response DTO
      const createUserResponseDTO = UserMapper.toResponse(newUser);

      this.logger.log(
        `User creation with email ${createUserResponseDTO.email} completed successfully.`,
      );

      return createUserResponseDTO;
    } catch (error: unknown) {
      handleServiceError({
        error,
        logger: this.logger,
        errorMessageService: this.errorMessageService,
        errorCode: ErrorCode.USER_CREATION_FAILED,
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        logMessage: 'Error creating user',
        logContext: {
          email: userData.email,
        },
        errorParams: {
          EMAIL: userData.email,
        },
      });
    }
  }
}
