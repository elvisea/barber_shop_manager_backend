import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  ResendVerificationRequestDto,
  ResendVerificationResponseDto,
} from '../dtos';
import { UserRepository } from '../repositories/user.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { maskEmail } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserVerificationTokenSentEvent } from '@/modules/emails/events/user-verification-token-sent.event';
import { EmailVerificationTokenService } from '@/modules/tokens/services/email-verification-token.service';

@Injectable()
export class ResendVerificationService {
  private readonly logger = new Logger(ResendVerificationService.name);

  private static readonly EXPIRATION_MINUTES = 15;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailVerificationTokenService: EmailVerificationTokenService,
    private readonly errorMessageService: ErrorMessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    resendDto: ResendVerificationRequestDto,
  ): Promise<ResendVerificationResponseDto> {
    this.logger.debug('Starting resend verification process', {
      email: maskEmail(resendDto.email),
    });

    // Buscar usuário por email
    const user = await this.userRepository.findByEmail(resendDto.email);

    if (!user) {
      this.logger.warn('User not found', {
        email: maskEmail(resendDto.email),
      });

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.USER_NOT_FOUND,
        { EMAIL: resendDto.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND,
      );
    }

    // Validar que email não está verificado
    if (user.emailVerified) {
      this.logger.warn('Email already verified', {
        userId: user.id,
        email: maskEmail(user.email),
      });

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.EMAIL_ALREADY_VERIFIED,
        { EMAIL: resendDto.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.CONFLICT,
        ErrorCode.EMAIL_ALREADY_VERIFIED,
      );
    }

    // Criar novo token de verificação
    const { token, tokenRecord } =
      await this.emailVerificationTokenService.createEmailVerificationToken(
        user.id,
        ResendVerificationService.EXPIRATION_MINUTES,
      );

    this.logger.debug('New verification token created', {
      userId: user.id,
      tokenId: tokenRecord.id,
      expiresAt: tokenRecord.expiresAt,
    });

    // Formatar data de expiração
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
      template: 'email_verification_resend',
    });
    this.eventEmitter.emit(
      'user.verification.token.sent',
      verificationTokenSentEvent,
    );

    this.logger.log('Verification token event emitted', {
      userId: user.id,
      email: maskEmail(user.email),
    });

    return {
      success: true,
      message: 'Novo código de verificação enviado com sucesso!',
    };
  }
}
