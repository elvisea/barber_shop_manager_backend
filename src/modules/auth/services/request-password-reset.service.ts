import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { RequestPasswordResetRequestDto } from '../dtos';

import { maskEmail } from '@/common/utils';
import { PasswordResetTokenSentEvent } from '@/modules/emails/events/password-reset-token-sent.event';
import { PasswordResetTokenService } from '@/modules/tokens/services/password-reset-token.service';
import { UserRepository } from '@/modules/user/repositories/user.repository';

@Injectable()
export class RequestPasswordResetService {
  private readonly logger = new Logger(RequestPasswordResetService.name);

  private static readonly EXPIRATION_MINUTES = 15;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenService: PasswordResetTokenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(requestDto: RequestPasswordResetRequestDto): Promise<void> {
    this.logger.debug('Starting password reset request process', {
      email: maskEmail(requestDto.email),
    });

    // Buscar usuário por email
    const user = await this.userRepository.findByEmail(requestDto.email);

    // Por segurança, sempre retornar sucesso mesmo se o usuário não existir
    // Isso evita revelar quais emails estão cadastrados no sistema
    if (!user) {
      this.logger.debug('User not found, returning generic success message', {
        email: maskEmail(requestDto.email),
      });

      return;
    }

    // Verificar se o email está verificado (requisito para redefinir senha)
    if (!user.emailVerified) {
      this.logger.debug(
        'User email not verified, returning generic success message',
        {
          userId: user.id,
          email: maskEmail(user.email),
        },
      );

      return;
    }

    // Criar token de redefinição de senha
    const { token, tokenRecord } =
      await this.passwordResetTokenService.createPasswordResetToken(
        user.id,
        RequestPasswordResetService.EXPIRATION_MINUTES,
      );

    this.logger.debug('Password reset token created', {
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

    // Emitir evento de token de redefinição de senha enviado
    const passwordResetTokenSentEvent = new PasswordResetTokenSentEvent({
      userId: user.id,
      email: user.email,
      name: user.name,
      token,
      expiresAt: expiresAtFormatted,
    });

    this.eventEmitter.emit(
      'password.reset.token.sent',
      passwordResetTokenSentEvent,
    );

    this.logger.log('Password reset token event emitted', {
      userId: user.id,
      email: maskEmail(user.email),
    });
  }
}
