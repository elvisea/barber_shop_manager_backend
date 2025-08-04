import { Injectable } from '@nestjs/common';
import { UserEmailVerification } from '@prisma/client';

import { IUserEmailVerificationRepository } from '../contracts/user-email-verification-repository.interface';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserEmailVerificationRepository
  implements IUserEmailVerificationRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createUserEmailVerification(data: {
    token: string;
    expiresAt: Date;
    userId: string;
  }): Promise<UserEmailVerification> {
    return this.prisma.userEmailVerification.create({
      data: {
        token: data.token,
        expiresAt: data.expiresAt,
        userId: data.userId,
      },
    });
  }

  async findByToken(token: string): Promise<UserEmailVerification | null> {
    return this.prisma.userEmailVerification.findUnique({
      where: { token },
    });
  }

  async findByUserId(userId: string): Promise<UserEmailVerification | null> {
    return this.prisma.userEmailVerification.findUnique({
      where: { userId },
    });
  }

  async updateVerification(
    id: string,
    data: { verified: boolean },
  ): Promise<UserEmailVerification> {
    return this.prisma.userEmailVerification.update({
      where: { id },
      data: { verified: data.verified },
    });
  }

  async deleteVerification(id: string): Promise<void> {
    await this.prisma.userEmailVerification.delete({
      where: { id },
    });
  }

  async deleteExpiredVerifications(): Promise<number> {
    const result = await this.prisma.userEmailVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  }
}
