import { Injectable, Logger } from '@nestjs/common';
import { Token, TokenType } from '@prisma/client';

import { TokenRepository } from '../repositories/token.repository';

import { generateVerificationData } from '@/utils/generate-verification-data';

export interface TokenCreationResult {
  token: string; // plain token para enviar por email
  tokenRecord: Token; // registro salvo no banco
}

@Injectable()
export class EmailVerificationTokenService {
  private readonly logger = new Logger(EmailVerificationTokenService.name);

  constructor(private readonly tokenRepository: TokenRepository) {}

  async createEmailVerificationToken(
    userId: string,
    expirationMinutes: number = 15,
  ): Promise<TokenCreationResult> {
    this.logger.debug('Creating email verification token', {
      userId,
      expirationMinutes,
    });

    // Invalidar tokens anteriores do mesmo tipo
    await this.tokenRepository.invalidateUserTokens(
      userId,
      TokenType.EMAIL_VERIFICATION,
    );

    // Gerar dados de verificação (token plain + hash + expiração)
    const { token, hashedToken, expiresAt } =
      await generateVerificationData(expirationMinutes);

    // Criar registro no banco com o hash
    const tokenRecord = await this.tokenRepository.create({
      userId,
      type: TokenType.EMAIL_VERIFICATION,
      token: hashedToken,
      expiresAt,
    });

    this.logger.debug('Email verification token created', {
      userId,
      tokenId: tokenRecord.id,
      expiresAt,
    });

    return {
      token,
      tokenRecord,
    };
  }

  async createEmailVerificationTokenForMember(
    memberId: string,
    expirationMinutes: number = 15,
  ): Promise<TokenCreationResult> {
    this.logger.debug('Creating email verification token for member', {
      memberId,
      expirationMinutes,
    });

    // Invalidar tokens anteriores do mesmo tipo
    await this.tokenRepository.invalidateMemberTokens(
      memberId,
      TokenType.EMAIL_VERIFICATION,
    );

    // Gerar dados de verificação (token plain + hash + expiração)
    const { token, hashedToken, expiresAt } =
      await generateVerificationData(expirationMinutes);

    // Criar registro no banco com o hash
    const tokenRecord = await this.tokenRepository.create({
      userId: undefined, // userId é opcional para tokens de members
      memberId,
      type: TokenType.EMAIL_VERIFICATION,
      token: hashedToken,
      expiresAt,
    });

    this.logger.debug('Email verification token created for member', {
      memberId,
      tokenId: tokenRecord.id,
      expiresAt,
    });

    return {
      token,
      tokenRecord,
    };
  }

  async invalidateEmailVerificationTokens(
    userId?: string,
    memberId?: string,
  ): Promise<void> {
    this.logger.debug('Invalidating email verification tokens', {
      userId,
      memberId,
    });

    if (memberId) {
      await this.tokenRepository.invalidateMemberTokens(
        memberId,
        TokenType.EMAIL_VERIFICATION,
      );
    } else if (userId) {
      await this.tokenRepository.invalidateUserTokens(
        userId,
        TokenType.EMAIL_VERIFICATION,
      );
    }
  }
}
