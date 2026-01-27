import { Injectable, Logger } from '@nestjs/common';
import { Token, TokenType } from '@prisma/client';

import { TokenRepository } from '../repositories/token.repository';

import { TokenValidationService } from './token-validation.service';

import { generateVerificationData } from '@/utils/generate-verification-data';

export interface TokenCreationResult {
  token: string; // plain token para enviar por email
  tokenRecord: Token; // registro salvo no banco
}

@Injectable()
export class PasswordResetTokenService {
  private readonly logger = new Logger(PasswordResetTokenService.name);

  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly tokenValidationService: TokenValidationService,
  ) {}

  async createPasswordResetToken(
    userId: string,
    expirationMinutes: number = 15,
  ): Promise<TokenCreationResult> {
    this.logger.debug('Creating password reset token', {
      userId,
      expirationMinutes,
    });

    // Invalidar tokens anteriores do mesmo tipo
    await this.tokenRepository.invalidateUserTokens(
      userId,
      TokenType.PASSWORD_RESET,
    );

    // Gerar dados de verificação (token plain + hash + expiração)
    const { token, hashedToken, expiresAt } =
      await generateVerificationData(expirationMinutes);

    // Criar registro no banco com o hash
    const tokenRecord = await this.tokenRepository.create({
      userId,
      type: TokenType.PASSWORD_RESET,
      token: hashedToken,
      expiresAt,
    });

    this.logger.debug('Password reset token created', {
      userId,
      tokenId: tokenRecord.id,
      expiresAt,
    });

    return {
      token,
      tokenRecord,
    };
  }

  async invalidatePasswordResetTokens(userId: string): Promise<void> {
    this.logger.debug('Invalidating password reset tokens', { userId });

    await this.tokenRepository.invalidateUserTokens(
      userId,
      TokenType.PASSWORD_RESET,
    );
  }

  async validatePasswordResetToken(
    token: string,
    userId: string,
  ): Promise<Token | null> {
    this.logger.debug('Validating password reset token', { userId });

    return this.tokenValidationService.getTokenRecord(
      token,
      userId,
      TokenType.PASSWORD_RESET,
    );
  }
}
