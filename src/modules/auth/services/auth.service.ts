import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { compare } from 'bcryptjs';

import { CreateAuthRequestDTO } from '../dtos/create-auth-request.dto';
import { CreateAuthResponseDTO } from '../dtos/create-auth-response.dto';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { RefreshTokenRepository } from '@/modules/refresh-token/repositories/refresh-token.repository';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { UserEmailVerificationResendService } from '@/modules/user-email-verification/services/user-email-verification-resend.service';
import { TokenService } from '@/shared/token/token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly errorMessageService: ErrorMessageService,
    private readonly userEmailVerificationResendService: UserEmailVerificationResendService,
  ) {}

  async execute(
    authRequest: CreateAuthRequestDTO,
  ): Promise<CreateAuthResponseDTO> {
    this.logger.log(
      `Starting authentication process for email: ${authRequest.email}`,
    );

    const userWithVerification =
      await this.userRepository.findByEmailWithVerification(authRequest.email);

    /**
     * The user is not found.
     */
    if (!userWithVerification) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.INVALID_EMAIL_OR_PASSWORD,
        { EMAIL: authRequest.email },
      );
      this.logger.warn(errorMessage);
      throw new CustomHttpException(
        errorMessage,
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_EMAIL_OR_PASSWORD,
      );
    }

    const isPasswordValid = await compare(
      authRequest.password,
      userWithVerification.password,
    );

    /**
     * The password is invalid.
     */
    if (!isPasswordValid) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.INVALID_EMAIL_OR_PASSWORD,
        { EMAIL: authRequest.email },
      );

      this.logger.warn(errorMessage);

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_EMAIL_OR_PASSWORD,
      );
    }

    /**
     * Check if email is verified.
     */
    if (!userWithVerification.emailVerification?.verified) {
      this.logger.warn(
        `Email not verified for user: ${userWithVerification.id}`,
      );

      // Re-send verification email
      try {
        await this.userEmailVerificationResendService.execute(
          authRequest.email,
        );
        this.logger.log(`Verification email re-sent for: ${authRequest.email}`);
      } catch (resendError: unknown) {
        const errorMessage =
          resendError instanceof Error
            ? resendError.message
            : String(resendError);
        this.logger.error('Failed to re-send verification email', {
          email: authRequest.email,
          error: errorMessage,
        });
        // Don't throw error here, just log it
      }

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.EMAIL_NOT_VERIFIED,
        { EMAIL: authRequest.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.UNAUTHORIZED,
        ErrorCode.EMAIL_NOT_VERIFIED,
      );
    }

    this.logger.log(
      `Authentication successful for email [${authRequest.email}].`,
    );

    const payload = {
      sub: userWithVerification.id,
      role: userWithVerification.role,
    };

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(payload);

    const expiresAt = new Date();
    expiresAt.setUTCDate(expiresAt.getUTCDate() + 7);

    await this.refreshTokenRepository.create({
      refreshToken,
      expiresAt,
      userId: userWithVerification.id,
      ipAddress: authRequest.ipAddress,
      userAgent: authRequest.userAgent,
    });

    this.logger.log(`Tokens generated successfully. Sending auth response.`);

    return {
      accessToken,
      refreshToken,
    };
  }
}
