import { Injectable, Logger } from '@nestjs/common';
import { Token, TokenType } from '@prisma/client';
import { compare } from 'bcryptjs';

import { TokenRepository } from '../repositories/token.repository';

import { generateVerificationData } from '@/utils/generate-verification-data';

export interface TokenCreationResult {
  token: string; // plain token para enviar por email
  tokenRecord: Token; // registro salvo no banco
}

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

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
    await this.invalidatePreviousTokens(userId, TokenType.EMAIL_VERIFICATION);

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

    // Retornar token plain para envio por email e registro salvo
    return {
      token,
      tokenRecord,
    };
  }

  async createPasswordResetToken(
    userId: string,
    expirationMinutes: number = 15,
  ): Promise<TokenCreationResult> {
    this.logger.debug('Creating password reset token', {
      userId,
      expirationMinutes,
    });

    // Invalidar tokens anteriores do mesmo tipo
    await this.invalidatePreviousTokens(userId, TokenType.PASSWORD_RESET);

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

    // Retornar token plain para envio por email e registro salvo
    return {
      token,
      tokenRecord,
    };
  }

  async validatePasswordResetToken(
    token: string,
    userId: string,
  ): Promise<Token | null> {
    this.logger.debug('Validating password reset token', { userId });

    return this.validateAndGetTokenRecord(
      token,
      userId,
      TokenType.PASSWORD_RESET,
    );
  }

  async validateToken(
    token: string,
    userId: string,
    type: TokenType = TokenType.EMAIL_VERIFICATION,
  ): Promise<boolean> {
    this.logger.debug('Validating token', { userId, type });

    const tokenRecord = await this.validateAndGetTokenRecord(
      token,
      userId,
      type,
    );

    return tokenRecord !== null;
  }

  async invalidatePreviousTokens(
    userId: string,
    type: TokenType,
  ): Promise<void> {
    this.logger.debug('Invalidating previous tokens', { userId, type });

    await this.tokenRepository.invalidateUserTokens(userId, type);
  }

  async markTokenAsUsed(tokenId: string): Promise<Token> {
    this.logger.debug('Marking token as used', { tokenId });

    return this.tokenRepository.markAsUsed(tokenId);
  }

  async getTokenRecord(
    token: string,
    userId: string,
    type: TokenType = TokenType.EMAIL_VERIFICATION,
  ): Promise<Token | null> {
    this.logger.debug('Getting token record', { userId, type });

    return this.validateAndGetTokenRecord(token, userId, type);
  }

  /**
   * Valida um token e retorna o registro se válido, ou null se inválido.
   * Método privado compartilhado entre validateToken e getTokenRecord.
   */
  private async validateAndGetTokenRecord(
    token: string,
    userId: string,
    type: TokenType,
  ): Promise<Token | null> {
    // Buscar token ativo do usuário
    const tokenRecord = await this.tokenRepository.findByUserIdAndType(
      userId,
      type,
    );

    if (!tokenRecord) {
      this.logger.warn('Token not found', { userId, type });
      return null;
    }

    // Comparar token plain com hash salvo
    const isValid = await compare(token, tokenRecord.token);

    if (!isValid) {
      this.logger.warn('Invalid token', { userId, type });
      return null;
    }

    // Verificar se não expirou
    if (new Date() > tokenRecord.expiresAt) {
      this.logger.warn('Token expired', {
        userId,
        type,
        expiresAt: tokenRecord.expiresAt,
      });
      return null;
    }

    // Verificar se já foi usado
    if (tokenRecord.used) {
      this.logger.warn('Token already used', { userId, type });
      return null;
    }

    this.logger.debug('Token validated successfully', { userId, type });
    return tokenRecord;
  }
}
