import { RefreshToken } from '@prisma/client';

import { CreateRefreshTokenDTO } from '../dtos/create-refresh-token.dto';

export interface IRefreshTokenRepository {
  create(data: CreateRefreshTokenDTO): Promise<RefreshToken>;
} 