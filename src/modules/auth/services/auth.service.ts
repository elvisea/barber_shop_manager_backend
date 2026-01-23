import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { compare } from 'bcryptjs';

import { CreateAuthRequestDTO } from '../dtos/create-auth-request.dto';
import { CreateAuthResponseDTO } from '../dtos/create-auth-response.dto';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { RefreshTokenRepository } from '@/modules/refresh-token/repositories/refresh-token.repository';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { TokenService } from '@/shared/token/token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    authRequest: CreateAuthRequestDTO,
  ): Promise<CreateAuthResponseDTO> {
    this.logger.log(
      `Starting authentication process for email: ${authRequest.email}`,
    );

    const user = await this.userRepository.findByEmail(authRequest.email);

    /**
     * The user is not found.
     */
    if (!user) {
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

    const isPasswordValid = await compare(authRequest.password, user.password);

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
    if (!user.emailVerified) {
      this.logger.warn(`Email not verified for user: ${user.id}`);

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
      sub: user.id,
      role: user.role,
    };

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(payload);

    const expiresAt = new Date();
    expiresAt.setUTCDate(expiresAt.getUTCDate() + 7);

    await this.refreshTokenRepository.create({
      refreshToken,
      expiresAt,
      userId: user.id,
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
