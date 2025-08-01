import { Injectable } from '@nestjs/common';
import { MemberRefreshToken } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MemberRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: {
    refreshToken: string;
    expiresAt: Date;
    memberId: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<MemberRefreshToken> {
    return this.prisma.memberRefreshToken.create({
      data: {
        token: data.refreshToken,
        expiresAt: data.expiresAt,
        memberId: data.memberId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async findByToken(token: string): Promise<MemberRefreshToken | null> {
    return this.prisma.memberRefreshToken.findUnique({
      where: { token },
    });
  }

  async revokeToken(token: string): Promise<void> {
    await this.prisma.memberRefreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.prisma.memberRefreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
