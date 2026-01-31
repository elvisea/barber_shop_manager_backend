import { Injectable, Logger } from '@nestjs/common';
import { UserEstablishment, UserRole, Prisma } from '@prisma/client';

import { IUserEstablishmentRepository } from '../contracts/user-establishment-repository.interface';

import { PrismaService } from '@/prisma/prisma.service';

type UserEstablishmentWithRelations = Prisma.UserEstablishmentGetPayload<{
  include: { user: true; establishment: true };
}>;

@Injectable()
export class UserEstablishmentRepository implements IUserEstablishmentRepository {
  private readonly logger = new Logger(UserEstablishmentRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    establishmentId: string;
    role: UserRole;
  }): Promise<UserEstablishment> {
    this.logger.log(
      `Creating user-establishment relationship: user ${data.userId} -> establishment ${data.establishmentId}`,
    );

    return this.prisma.userEstablishment.create({
      data: {
        userId: data.userId,
        establishmentId: data.establishmentId,
        role: data.role,
      },
    });
  }

  async findById(id: string): Promise<UserEstablishment | null> {
    return this.prisma.userEstablishment.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<UserEstablishment | null> {
    return this.prisma.userEstablishment.findFirst({
      where: {
        userId,
        establishmentId,
        deletedAt: null,
      },
    });
  }

  async findByUserAndEstablishmentWithRelations(
    userId: string,
    establishmentId: string,
  ): Promise<UserEstablishmentWithRelations | null> {
    return this.prisma.userEstablishment.findFirst({
      where: {
        userId,
        establishmentId,
        deletedAt: null,
      },
      include: {
        user: true,
        establishment: true,
      },
    });
  }

  async findAllByUser(userId: string): Promise<UserEstablishment[]> {
    return this.prisma.userEstablishment.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByUserWithRelations(
    userId: string,
  ): Promise<UserEstablishmentWithRelations[]> {
    return this.prisma.userEstablishment.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        user: true,
        establishment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByEstablishment(
    establishmentId: string,
  ): Promise<UserEstablishment[]> {
    return this.prisma.userEstablishment.findMany({
      where: {
        establishmentId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
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
    data: UserEstablishmentWithRelations[];
    total: number;
  }> {
    const [userEstablishments, total] = await Promise.all([
      this.prisma.userEstablishment.findMany({
        where: { establishmentId, deletedAt: null },
        skip,
        take,
        include: { user: true, establishment: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.userEstablishment.count({
        where: { establishmentId, deletedAt: null },
      }),
    ]);
    return {
      data: userEstablishments,
      total,
    };
  }

  async findByUserAndEstablishmentId(
    userId: string,
    establishmentId: string,
  ): Promise<UserEstablishmentWithRelations | null> {
    return this.prisma.userEstablishment.findFirst({
      where: {
        userId,
        establishmentId,
        deletedAt: null,
      },
      include: {
        user: true,
        establishment: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      role: UserRole;
      isActive: boolean;
    }>,
  ): Promise<UserEstablishment> {
    return this.prisma.userEstablishment.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, deletedByUserId?: string): Promise<void> {
    await this.prisma.userEstablishment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: deletedByUserId ?? undefined,
      },
    });
  }

  async existsByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<boolean> {
    const count = await this.prisma.userEstablishment.count({
      where: {
        userId,
        establishmentId,
        deletedAt: null,
      },
    });
    return count > 0;
  }
}
