import { RefreshToken } from '@prisma/client';

import { CreateRefreshTokenDTO } from '../dtos/create-refresh-token.dto';
import { RefreshTokenWithUser } from '../types/refresh-token-with-user.type';

export interface IRefreshTokenRepository {
  create(data: CreateRefreshTokenDTO): Promise<RefreshToken>;
  invalidateAllUserTokens(userId: string): Promise<void>;
  findByToken(token: string): Promise<RefreshTokenWithUser | null>;
  revokeById(id: string): Promise<void>;
}
