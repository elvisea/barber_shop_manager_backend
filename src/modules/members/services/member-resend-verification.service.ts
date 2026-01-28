import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { MemberVerificationTokenSentEvent } from '@/modules/emails/events/member-verification-token-sent.event';
import { EmailVerificationTokenService } from '@/modules/tokens/services/email-verification-token.service';

export interface MemberResendVerificationRequest {
  email: string;
}

export interface MemberResendVerificationResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class MemberResendVerificationService {
  private readonly logger = new Logger(MemberResendVerificationService.name);

  /**
   * Tempo de expiração da verificação de email em minutos.
   * 15 minutos (reduzido de 24 horas para maior segurança).
   */
  private static readonly EXPIRATION_MINUTES = 15;

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly emailVerificationTokenService: EmailVerificationTokenService,
    private readonly errorMessageService: ErrorMessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    request: MemberResendVerificationRequest,
  ): Promise<MemberResendVerificationResponse> {
    this.logger.debug('Starting resend verification process for member', {
      email: request.email,
    });

    // Buscar member por email
    const member = await this.memberRepository.findByEmail(request.email);

    if (!member) {
      this.logger.warn('Member not found', {
        email: request.email,
      });

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        { EMAIL: request.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_NOT_FOUND,
      );
    }

    // Criar novo token de verificação
    const { token, tokenRecord } =
      await this.emailVerificationTokenService.createEmailVerificationToken(
        member.id,
        MemberResendVerificationService.EXPIRATION_MINUTES,
      );

    this.logger.debug('New verification token created for member', {
      memberId: member.id,
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
    const verificationTokenSentEvent = new MemberVerificationTokenSentEvent({
      memberId: member.id,
      email: member.email,
      name: member.name,
      token,
      expiresAt: expiresAtFormatted,
    });
    this.eventEmitter.emit(
      'member.verification.token.sent',
      verificationTokenSentEvent,
    );

    this.logger.log('Verification token event emitted for member', {
      memberId: member.id,
      email: request.email,
    });

    return {
      success: true,
      message: 'Novo código de verificação enviado com sucesso!',
    };
  }
}
