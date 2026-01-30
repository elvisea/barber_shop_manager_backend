import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateRefreshTokenDTO } from '../dtos/create-refresh-token.dto';
import { RefreshTokenRequestDTO } from '../dtos/refresh-token-request.dto';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

import { BaseAuthResponseDTO } from '@/common/dtos/base-auth-response.dto';
import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { TokenService } from '@/shared/token/token.service';

@Injectable()
export class RefreshTokenRefreshService {
  private readonly logger = new Logger(RefreshTokenRefreshService.name);

  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Validates the refresh token, issues new access and refresh tokens,
   * revokes the old refresh token (rotation) and persists the new one.
   */
  async execute(
    dto: RefreshTokenRequestDTO,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<BaseAuthResponseDTO> {
    this.logger.log('Starting refresh token flow.');

    try {
      await this.jwtService.verifyAsync(dto.refreshToken);
    } catch {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.REFRESH_TOKEN_INVALID,
        {},
      );
      this.logger.warn(errorMessage);
      throw new CustomHttpException(
        errorMessage,
        HttpStatus.UNAUTHORIZED,
        ErrorCode.REFRESH_TOKEN_INVALID,
      );
    }

    const record = await this.refreshTokenRepository.findByToken(
      dto.refreshToken,
    );

    if (!record) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.REFRESH_TOKEN_INVALID,
        {},
      );
      this.logger.warn(errorMessage);
      throw new CustomHttpException(
        errorMessage,
        HttpStatus.UNAUTHORIZED,
        ErrorCode.REFRESH_TOKEN_INVALID,
      );
    }

    const tokenPayload = {
      sub: record.user.id,
      role: record.user.role,
    };

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(tokenPayload);

    await this.refreshTokenRepository.revokeById(record.id);

    const expiresAt = new Date();
    expiresAt.setUTCDate(expiresAt.getUTCDate() + 7);

    const createData: CreateRefreshTokenDTO = {
      refreshToken,
      expiresAt,
      userId: record.user.id,
      ipAddress,
      userAgent,
    };

    await this.refreshTokenRepository.create(createData);

    this.logger.log(
      `Refresh completed for user [${record.user.id}]. New tokens issued.`,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
