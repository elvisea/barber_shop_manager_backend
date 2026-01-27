import { Injectable, Logger } from '@nestjs/common';
import { Token, TokenType } from '@prisma/client';

import {
  CreateTokenData,
  ITokenRepository,
} from '../contracts/token-repository.interface';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TokenRepository implements ITokenRepository {
  private readonly logger = new Logger(TokenRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTokenData): Promise<Token> {
    this.logger.debug('Creating token', {
      userId: data.userId,
      memberId: data.memberId,
      type: data.type,
    });

    return this.prisma.token.create({
      data: {
        ...(data.userId && { userId: data.userId }),
        ...(data.memberId && { memberId: data.memberId }),
        type: data.type,
        token: data.token,
        expiresAt: data.expiresAt,
        ...(data.metadata && { metadata: data.metadata as object }),
      },
    });
  }

  async findByUserIdAndType(
    userId: string,
    type: TokenType,
  ): Promise<Token | null> {
    this.logger.debug('Finding token by userId and type', {
      userId,
      type,
    });

    return this.prisma.token.findFirst({
      where: {
        userId,
        type,
        used: false,
        deletedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByMemberIdAndType(
    memberId: string,
    type: TokenType,
  ): Promise<Token | null> {
    this.logger.debug('Finding token by memberId and type', {
      memberId,
      type,
    });

    return this.prisma.token.findFirst({
      where: {
        memberId,
        type,
        used: false,
        deletedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByTokenHash(tokenHash: string): Promise<Token | null> {
    this.logger.debug('Finding token by hash');

    return this.prisma.token.findFirst({
      where: {
        token: tokenHash,
        used: false,
        deletedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async markAsUsed(id: string): Promise<Token> {
    this.logger.debug('Marking token as used', { id });

    return this.prisma.token.update({
      where: { id },
      data: { used: true },
    });
  }

  async invalidateUserTokens(userId: string, type: TokenType): Promise<void> {
    this.logger.debug('Invalidating user tokens', { userId, type });

    await this.prisma.token.updateMany({
      where: {
        userId,
        type,
        used: false,
        deletedAt: null,
      },
      data: {
        used: true,
      },
    });
  }

  async invalidateMemberTokens(
    memberId: string,
    type: TokenType,
  ): Promise<void> {
    this.logger.debug('Invalidating member tokens', { memberId, type });

    await this.prisma.token.updateMany({
      where: {
        memberId,
        type,
        used: false,
        deletedAt: null,
      },
      data: {
        used: true,
      },
    });
  }
}
