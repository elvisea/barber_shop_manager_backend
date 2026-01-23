import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TokenType } from '@prisma/client';

import { VerifyEmailRequestDto, VerifyEmailResponseDto } from '../dtos';
import { UserRepository } from '../repositories/user.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { maskEmail } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { TokenService } from '@/modules/tokens/services/token.service';

@Injectable()
export class VerifyEmailService {
  private readonly logger = new Logger(VerifyEmailService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    verifyEmailDto: VerifyEmailRequestDto,
  ): Promise<VerifyEmailResponseDto> {
    this.logger.debug('Starting email verification process', {
      email: maskEmail(verifyEmailDto.email),
    });

    // Buscar usuário por email
    const user = await this.userRepository.findByEmail(verifyEmailDto.email);

    if (!user) {
      this.logger.warn('User not found', {
        email: maskEmail(verifyEmailDto.email),
      });

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.USER_NOT_FOUND,
        { EMAIL: verifyEmailDto.email },
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
        { EMAIL: verifyEmailDto.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.CONFLICT,
        ErrorCode.EMAIL_ALREADY_VERIFIED,
      );
    }

    // Obter token record e validar
    const tokenRecord = await this.tokenService.getTokenRecord(
      verifyEmailDto.token,
      user.id,
      TokenType.EMAIL_VERIFICATION,
    );

    if (!tokenRecord) {
      this.logger.warn('Invalid or expired token', {
        userId: user.id,
        email: maskEmail(user.email),
      });

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.INVALID_VERIFICATION_TOKEN,
        { TOKEN: verifyEmailDto.token },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.BAD_REQUEST,
        ErrorCode.INVALID_VERIFICATION_TOKEN,
      );
    }

    // Executar operações em paralelo
    await Promise.all([
      this.tokenService.markTokenAsUsed(tokenRecord.id),
      this.userRepository.updateEmailVerified(user.id, true),
    ]);

    this.logger.log('Email verified successfully', {
      userId: user.id,
      email: maskEmail(user.email),
    });

    return {
      success: true,
      message: 'Email verificado com sucesso!',
    };
  }
}
