import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ResetPasswordRequestDto } from '../dtos';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { maskEmail } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { PasswordResetEvent } from '@/modules/emails/events/password-reset.event';
import { RefreshTokenRepository } from '@/modules/refresh-token/repositories/refresh-token.repository';
import { PasswordResetTokenService } from '@/modules/tokens/services/password-reset-token.service';
import { TokenValidationService } from '@/modules/tokens/services/token-validation.service';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { hashValue } from '@/utils/hash-value';

@Injectable()
export class ResetPasswordService {
  private readonly logger = new Logger(ResetPasswordService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenService: PasswordResetTokenService,
    private readonly tokenValidationService: TokenValidationService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(resetDto: ResetPasswordRequestDto): Promise<void> {
    this.logger.debug('Starting password reset process', {
      email: maskEmail(resetDto.email),
    });

    // Validar que as senhas são iguais
    if (resetDto.newPassword !== resetDto.confirmPassword) {
      this.logger.warn('Password confirmation mismatch', {
        email: maskEmail(resetDto.email),
      });

      throw new CustomHttpException(
        'As senhas não coincidem. Por favor, verifique e tente novamente.',
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_ERROR,
      );
    }

    // Buscar usuário por email
    const user = await this.userRepository.findByEmail(resetDto.email);

    if (!user) {
      this.logger.warn('User not found', {
        email: maskEmail(resetDto.email),
      });

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.USER_NOT_FOUND,
        { EMAIL: resetDto.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND,
      );
    }

    // Validar token usando o método reutilizável
    const tokenRecord =
      await this.passwordResetTokenService.validatePasswordResetToken(
        resetDto.token,
        user.id,
      );

    if (!tokenRecord) {
      this.logger.warn('Invalid or expired password reset token', {
        userId: user.id,
        email: maskEmail(user.email),
      });

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.INVALID_VERIFICATION_TOKEN,
        { EMAIL: resetDto.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.BAD_REQUEST,
        ErrorCode.INVALID_VERIFICATION_TOKEN,
      );
    }

    // Hash da nova senha
    const hashedPassword = await hashValue(resetDto.newPassword);
    this.logger.debug('New password hashed successfully', {
      userId: user.id,
    });

    // Atualizar senha, marcar token como usado e invalidar refresh tokens em paralelo
    await Promise.all([
      this.userRepository.updatePassword(user.id, hashedPassword),
      this.tokenValidationService.markTokenAsUsed(tokenRecord.id),
      this.refreshTokenRepository.invalidateAllUserTokens(user.id),
    ]);

    this.logger.log('Password reset successfully', {
      userId: user.id,
      email: maskEmail(user.email),
    });

    // Emitir evento de senha redefinida
    const passwordResetEvent = new PasswordResetEvent({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    this.eventEmitter.emit('password.reset', passwordResetEvent);

    this.logger.debug('Password reset event emitted', {
      userId: user.id,
      email: maskEmail(user.email),
    });
  }
}
