import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import { IRefreshTokenRepository } from '../contracts/refresh-token-repository.interface';
import { CreateRefreshTokenDTO } from '../dtos/create-refresh-token.dto';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) { }

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
} 