import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { hashValue } from '../../../utils/hash-value';
import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UserRepository } from '../repositories/user.repository';

import { EncryptionService } from '@/common/encryption/encryption.service';
import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { cleanCpf, handleServiceError, maskEmail } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserCreatedEvent } from '@/modules/emails/events/user-created.event';
import { UserVerificationTokenSentEvent } from '@/modules/emails/events/user-verification-token-sent.event';
import { EmailVerificationTokenService } from '@/modules/tokens/services/email-verification-token.service';

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(CreateUserService.name);

  /**
   * Tempo de expiração da verificação de email em minutos.
   * 15 minutos (reduzido de 24 horas para maior segurança).
   */
  private static readonly EMAIL_VERIFICATION_EXPIRATION_MINUTES = 15;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly emailVerificationTokenService: EmailVerificationTokenService,
    private readonly eventEmitter: EventEmitter2,
    private readonly encryptionService: EncryptionService,
  ) {}

  async execute(
    userData: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    this.logger.debug('Starting user creation process', {
      email: maskEmail(userData.email),
      name: userData.name,
    });

    // Verificar se o usuário já existe
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      this.logger.debug('Found existing user', {
        userId: existingUser.id,
        email: maskEmail(existingUser.email),
        emailVerified: existingUser.emailVerified ?? false,
      });

      return this.handleExistingUser(
        {
          id: existingUser.id,
          email: existingUser.email,
          emailVerified: existingUser.emailVerified ?? false,
        },
        userData,
      );
    }

    this.logger.debug('Creating new user', {
      email: maskEmail(userData.email),
    });

    return this.createNewUser(userData);
  }

  private async handleExistingUser(
    user: { id: string; email: string; emailVerified?: boolean },
    userData: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    this.logger.debug('Processing existing user', {
      userId: user.id,
      email: maskEmail(user.email),
      emailVerified: user.emailVerified ?? false,
    });

    // Se o usuário já está verificado, lançar erro
    if (user.emailVerified === true) {
      this.throwEmailAlreadyVerified(user.email);
    }

    // Usuário existe mas não está verificado - criar novo token
    this.logger.debug(
      'User exists but not verified, creating verification token',
      {
        userId: user.id,
      },
    );

    await this.createAndSendVerificationToken(
      { id: user.id, email: user.email, name: userData.name },
      true,
    );

    // Buscar usuário atualizado
    const updatedUser = await this.userRepository.findById(user.id);
    if (!updatedUser) {
      throw new CustomHttpException(
        this.errorMessageService.getMessage(ErrorCode.USER_NOT_FOUND, {
          USER_ID: user.id,
        }),
        HttpStatus.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND,
      );
    }

    return UserMapper.toResponse(updatedUser);
  }

  private async createNewUser(
    dto: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    this.logger.debug('Creating user record');

    try {
      // Hash da senha
      const hashedPassword = await hashValue(dto.password);
      this.logger.debug('Password hashed successfully');

      // Limpar e criptografar CPF
      const cleanCpfValue = cleanCpf(dto.document);
      const encryptedDocument = this.encryptionService.encrypt(cleanCpfValue);
      this.logger.debug('Document encrypted successfully');

      // Criar usuário
      const newUser = await this.userRepository.createUser({
        name: dto.name.trim(),
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        password: hashedPassword,
        document: encryptedDocument,
      });

      this.logger.log('User created successfully', {
        userId: newUser.id,
        email: maskEmail(newUser.email),
      });

      // Emitir evento de usuário criado
      const userCreatedEvent = new UserCreatedEvent({
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
      });
      this.eventEmitter.emit('user.created', userCreatedEvent);

      // Criar token e enviar email de verificação
      await this.createAndSendVerificationToken(newUser, false);

      return UserMapper.toResponse(newUser);
    } catch (error: unknown) {
      handleServiceError({
        error,
        logger: this.logger,
        errorMessageService: this.errorMessageService,
        errorCode: ErrorCode.USER_CREATION_FAILED,
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        logMessage: 'Error creating user',
        logContext: {
          email: maskEmail(dto.email),
        },
        errorParams: {
          EMAIL: dto.email,
        },
      });
    }
  }

  private async createAndSendVerificationToken(
    user: { id: string; email: string; name: string },
    isExistingUser: boolean,
  ): Promise<void> {
    this.logger.debug('Creating verification token', {
      userId: user.id,
      isExistingUser,
    });

    // Criar token de verificação
    const { token, tokenRecord } =
      await this.emailVerificationTokenService.createEmailVerificationToken(
        user.id,
        CreateUserService.EMAIL_VERIFICATION_EXPIRATION_MINUTES,
      );

    this.logger.debug('Verification token created', {
      userId: user.id,
      tokenId: tokenRecord.id,
      expiresAt: tokenRecord.expiresAt,
    });

    // Formatar data de expiração no formato brasileiro
    const expiresAtFormatted = tokenRecord.expiresAt.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });

    // Emitir evento de token de verificação enviado
    const verificationTokenSentEvent = new UserVerificationTokenSentEvent({
      userId: user.id,
      email: user.email,
      name: user.name,
      token,
      expiresAt: expiresAtFormatted,
      template: isExistingUser
        ? 'account_creation_existing'
        : 'account_creation',
    });
    this.eventEmitter.emit(
      'user.verification.token.sent',
      verificationTokenSentEvent,
    );

    this.logger.debug('Verification token event emitted', {
      userId: user.id,
      template: isExistingUser
        ? 'account_creation_existing'
        : 'account_creation',
    });
  }

  private throwEmailAlreadyVerified(email: string): never {
    const errorMessage = this.errorMessageService.getMessage(
      ErrorCode.EMAIL_ALREADY_EXISTS_VERIFIED,
      { EMAIL: email },
    );

    this.logger.warn('Email already verified error', {
      email: maskEmail(email),
      errorCode: ErrorCode.EMAIL_ALREADY_EXISTS_VERIFIED,
    });

    throw new CustomHttpException(
      errorMessage,
      HttpStatus.CONFLICT,
      ErrorCode.EMAIL_ALREADY_EXISTS_VERIFIED,
    );
  }
}
