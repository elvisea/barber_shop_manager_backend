import { Token, TokenType } from '@prisma/client';

export interface CreateTokenData {
  userId?: string;
  memberId?: string;
  type: TokenType;
  token: string; // hash do token
  expiresAt: Date;
  metadata?: Record<string, unknown>;
}

export interface ITokenRepository {
  create(data: CreateTokenData): Promise<Token>;
  findByUserIdAndType(userId: string, type: TokenType): Promise<Token | null>;
  findByMemberIdAndType(
    memberId: string,
    type: TokenType,
  ): Promise<Token | null>;
  findByTokenHash(tokenHash: string): Promise<Token | null>;
  markAsUsed(id: string): Promise<Token>;
  invalidateUserTokens(userId: string, type: TokenType): Promise<void>;
  invalidateMemberTokens(memberId: string, type: TokenType): Promise<void>;
}
