import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';

import { IRefreshTokenRepository } from '../contracts/refresh-token-repository.interface';
import { CreateRefreshTokenDTO } from '../dtos/create-refresh-token.dto';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * The method to create a refresh token.
   * @param data - The data to create the refresh token.
   * @returns A promise that resolves to the created refresh token.
   */
  async create(data: CreateRefreshTokenDTO): Promise<RefreshToken> {
    return this.prismaService.refreshToken.create({
      data: {
        token: data.refreshToken,
        expiresAt: data.expiresAt,
        userId: data.userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  /**
   * Invalidates all refresh tokens for a user.
   * @param userId - The user ID.
   * @returns A promise that resolves when all tokens are invalidated.
   */
  async invalidateAllUserTokens(userId: string): Promise<void> {
    await this.prismaService.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }
}
