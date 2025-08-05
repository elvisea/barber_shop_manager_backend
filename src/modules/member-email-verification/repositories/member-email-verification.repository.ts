import { Injectable } from '@nestjs/common';
import { MemberEmailVerification } from '@prisma/client';

import { IMemberEmailVerificationRepository } from '../contracts/member-email-verification-repository.interface';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MemberEmailVerificationRepository
  implements IMemberEmailVerificationRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createMemberEmailVerification(data: {
    token: string;
    email: string;
    expiresAt: Date;
    memberId: string;
  }): Promise<MemberEmailVerification> {
    return this.prisma.memberEmailVerification.create({
      data: {
        token: data.token,
        email: data.email,
        expiresAt: data.expiresAt,
        memberId: data.memberId,
      },
    });
  }

  async findByEmail(email: string): Promise<MemberEmailVerification | null> {
    return this.prisma.memberEmailVerification.findUnique({
      where: { email },
    });
  }

  async findByMemberId(
    memberId: string,
  ): Promise<MemberEmailVerification | null> {
    return this.prisma.memberEmailVerification.findUnique({
      where: { memberId },
    });
  }

  async findAllNonExpired(): Promise<MemberEmailVerification[]> {
    return this.prisma.memberEmailVerification.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
        verified: false,
      },
    });
  }

  async updateVerification(
    id: string,
    data: { verified: boolean },
  ): Promise<MemberEmailVerification> {
    return this.prisma.memberEmailVerification.update({
      where: { id },
      data: { verified: data.verified },
    });
  }

  async updateTokenAndExpiration(
    id: string,
    data: { token: string; expiresAt: Date },
  ): Promise<MemberEmailVerification> {
    return this.prisma.memberEmailVerification.update({
      where: { id },
      data: {
        token: data.token,
        expiresAt: data.expiresAt,
      },
    });
  }

  async deleteVerification(id: string): Promise<void> {
    await this.prisma.memberEmailVerification.delete({
      where: { id },
    });
  }

  async deleteExpiredVerifications(): Promise<number> {
    const result = await this.prisma.memberEmailVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  }
}
