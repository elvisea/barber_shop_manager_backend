import { Injectable, Logger } from '@nestjs/common';
import { Token, TokenType } from '@prisma/client';
import { compare } from 'bcryptjs';

import { TokenRepository } from '../repositories/token.repository';

@Injectable()
export class TokenValidationService {
  private readonly logger = new Logger(TokenValidationService.name);

  constructor(private readonly tokenRepository: TokenRepository) {}

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

  async getTokenRecord(
    token: string,
    userId: string,
    type: TokenType = TokenType.EMAIL_VERIFICATION,
  ): Promise<Token | null> {
    this.logger.debug('Getting token record', { userId, type });

    return this.validateAndGetTokenRecord(token, userId, type);
  }

  async markTokenAsUsed(tokenId: string): Promise<Token> {
    this.logger.debug('Marking token as used', { tokenId });

    return this.tokenRepository.markAsUsed(tokenId);
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
