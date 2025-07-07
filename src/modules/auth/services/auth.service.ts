import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { compare } from 'bcryptjs';

import { CreateAuthRequestDTO } from '../dtos/create-auth-request.dto';
import { CreateAuthResponseDTO } from '../dtos/create-auth-response.dto';

import { TokenService } from './token.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { RefreshTokenRepository } from '@/modules/refresh-token/repositories/refresh-token.repository';
import { UserRepository } from '@/modules/user/repositories/user.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly errorMessagesService: ErrorMessageService,
  ) {}

  async execute(
    authRequest: CreateAuthRequestDTO,
  ): Promise<CreateAuthResponseDTO> {
    this.logger.log(
      `Starting authentication process for email: ${authRequest.email}`,
    );

    const user = await this.userRepository.findByEmailWithMemberships(
      authRequest.email,
    );

    /**
     * The user is not found.
     */
    if (!user) {
      const errorMessage = this.errorMessagesService.getMessage(
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
      const errorMessage = this.errorMessagesService.getMessage(
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

    this.logger.log(
      `Authentication successful for email [${authRequest.email}].`,
    );

    // Montar memberships para o payload
    const memberships = (user.memberships || []).map((m) => ({
      establishmentId: m.establishmentId,
      role: m.role,
      isActive: m.isActive,
    }));

    const payload = {
      sub: user.id,
      email: user.email,
      memberships,
    };

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

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
