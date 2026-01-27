import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { ValidatePasswordResetTokenRequestDto } from '../dtos';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { maskEmail } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { PasswordResetTokenService } from '@/modules/tokens/services/password-reset-token.service';
import { UserRepository } from '@/modules/user/repositories/user.repository';

@Injectable()
export class ValidatePasswordResetTokenService {
  private readonly logger = new Logger(ValidatePasswordResetTokenService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenService: PasswordResetTokenService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    validateDto: ValidatePasswordResetTokenRequestDto,
  ): Promise<void> {
    this.logger.debug('Starting password reset token validation', {
      email: maskEmail(validateDto.email),
    });

    // Buscar usuário por email
    const user = await this.userRepository.findByEmail(validateDto.email);

    if (!user) {
      this.logger.warn('User not found', {
        email: maskEmail(validateDto.email),
      });

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.USER_NOT_FOUND,
        { EMAIL: validateDto.email },
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
        validateDto.token,
        user.id,
      );

    if (!tokenRecord) {
      this.logger.warn('Invalid or expired password reset token', {
        userId: user.id,
        email: maskEmail(user.email),
      });

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.INVALID_VERIFICATION_TOKEN,
        { EMAIL: validateDto.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.BAD_REQUEST,
        ErrorCode.INVALID_VERIFICATION_TOKEN,
      );
    }

    this.logger.log('Password reset token validated successfully', {
      userId: user.id,
      email: maskEmail(user.email),
      tokenId: tokenRecord.id,
    });
  }
}
