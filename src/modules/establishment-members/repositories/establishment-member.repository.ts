import { Injectable } from '@nestjs/common';
import { Establishment, EstablishmentMember, Role, User } from '@prisma/client';

import { IEstablishmentMemberRepository } from '../contracts/establishment-member-repository.interface';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class EstablishmentMemberRepository
  implements IEstablishmentMemberRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findEstablishmentByIdAndAdmin(
    establishmentId: string,
    userId: string,
  ): Promise<(EstablishmentMember & { establishment: Establishment }) | null> {
    return this.prisma.establishmentMember.findFirst({
      where: {
        establishmentId,
        userId,
        role: Role.ADMIN,
      },
      include: { establishment: true },
    });
  }

  async createMember(data: {
    userId: string;
    establishmentId: string;
    role: Role;
  }): Promise<EstablishmentMember> {
    return this.prisma.establishmentMember.create({
      data: {
        userId: data.userId,
        establishmentId: data.establishmentId,
        role: data.role,
      },
    });
  }

  async existsByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<boolean> {
    const count = await this.prisma.establishmentMember.count({
      where: { userId, establishmentId },
    });
    return count > 0;
  }

  async deleteByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<void> {
    await this.prisma.establishmentMember.delete({
      where: {
        userId_establishmentId: {
          userId,
          establishmentId,
        },
      },
    });
  }

  async findByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<(EstablishmentMember & { user: User }) | null> {
    return this.prisma.establishmentMember.findUnique({
      where: {
        userId_establishmentId: {
          userId,
          establishmentId,
        },
      },
      include: { user: true },
    });
  }

  async findAllByEstablishmentPaginated({
    establishmentId,
    skip,
    take,
  }: {
    establishmentId: string;
    skip: number;
    take: number;
  }): Promise<{
    data: Array<EstablishmentMember & { user: User }>;
    total: number;
  }> {
    const [data, total] = await Promise.all([
      this.prisma.establishmentMember.findMany({
        where: { establishmentId },
        include: { user: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.establishmentMember.count({ where: { establishmentId } }),
    ]);
    return { data, total };
  }
}
