import { Injectable, Logger } from '@nestjs/common';
import {
  EstablishmentService,
  UserService as UserServiceModel,
} from '@prisma/client';

import { IMemberServiceRepository } from '../contracts/member-service-repository.interface';
import { MemberServiceWithRelations } from '../types/member-service-with-relations.type';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MemberServiceRepository implements IMemberServiceRepository {
  private readonly logger = new Logger(MemberServiceRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createMemberService(data: {
    memberId: string;
    establishmentId: string;
    serviceId: string;
    price: number;
    commission: number;
    duration: number;
  }): Promise<UserServiceModel> {
    return this.prisma.userService.create({
      data: {
        price: data.price,
        commission: data.commission,
        duration: data.duration,
        establishmentId: data.establishmentId,
        serviceId: data.serviceId,
        userId: data.memberId,
      },
    });
  }

  async findByMemberEstablishmentServiceWithRelations(
    memberId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<MemberServiceWithRelations | null> {
    return this.prisma.userService.findFirst({
      where: {
        userId: memberId,
        establishmentId,
        serviceId,
      },
      include: {
        user: true,
        service: {
          include: {
            establishment: true,
          },
        },
      },
    });
  }

  async existsByMemberEstablishmentService(
    memberId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<boolean> {
    const count = await this.prisma.userService.count({
      where: {
        userId: memberId,
        establishmentId,
        serviceId,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async findAllByMemberPaginated({
    establishmentId,
    memberId,
    skip,
    take,
  }: {
    establishmentId: string;
    memberId: string;
    skip: number;
    take: number;
  }): Promise<{
    data: (UserServiceModel & { service: EstablishmentService })[];
    total: number;
  }> {
    const where = {
      establishmentId,
      userId: memberId,
      deletedAt: null,
    };

    this.logger.debug(
      `Fetching member services with filters: establishmentId=${establishmentId}, memberId=${memberId}, deletedAt=null`,
    );

    const [data, total] = await Promise.all([
      this.prisma.userService.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { service: true },
      }),

      this.prisma.userService.count({ where }),
    ]);

    this.logger.debug(
      `Found ${total} member services (returning ${data.length} items)`,
    );

    return { data, total };
  }

  async updateMemberService(
    id: string,
    data: {
      price?: number;
      commission?: number;
      duration?: number;
    },
  ): Promise<UserServiceModel> {
    const updateData: {
      price?: number;
      commission?: number;
      duration?: number;
    } = {};

    if (data.price !== undefined) {
      updateData.price = data.price;
    }
    if (data.commission !== undefined) {
      updateData.commission = data.commission;
    }
    if (data.duration !== undefined) {
      updateData.duration = data.duration;
    }

    return this.prisma.userService.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteMemberService(id: string, deletedBy: string): Promise<void> {
    await this.prisma.userService.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }

  async findOneByMemberService(
    memberId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<(UserServiceModel & { service: EstablishmentService }) | null> {
    return this.prisma.userService.findFirst({
      where: {
        userId: memberId,
        establishmentId,
        serviceId,
        deletedAt: null,
      },
      include: { service: true },
    });
  }

  async findOneByMemberEstablishmentServiceIncludingDeleted(
    memberId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<UserServiceModel | null> {
    return this.prisma.userService.findFirst({
      where: {
        userId: memberId,
        establishmentId,
        serviceId,
      },
    });
  }

  async restoreMemberService(
    id: string,
    data: { price: number; commission: number; duration: number },
  ): Promise<UserServiceModel> {
    return this.prisma.userService.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        price: data.price,
        commission: data.commission,
        duration: data.duration,
      },
    });
  }
}
