import { Injectable, Logger } from '@nestjs/common';
import {
  EstablishmentService,
  MemberService as MemberServiceModel,
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
  }): Promise<MemberServiceModel> {
    return this.prisma.memberService.create({
      data: {
        price: data.price,
        commission: data.commission,
        duration: data.duration,
        establishmentId: data.establishmentId,
        serviceId: data.serviceId,
        memberId: data.memberId,
      },
    });
  }

  async findByMemberEstablishmentServiceWithRelations(
    memberId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<MemberServiceWithRelations | null> {
    return this.prisma.memberService.findFirst({
      where: {
        memberId,
        establishmentId,
        serviceId,
      },
      include: {
        member: {
          include: {
            establishment: true,
          },
        },
        service: true,
      },
    });
  }

  async existsByMemberEstablishmentService(
    memberId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<boolean> {
    const count = await this.prisma.memberService.count({
      where: {
        memberId,
        establishmentId,
        serviceId,
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
    data: (MemberServiceModel & { service: EstablishmentService })[];
    total: number;
  }> {
    const where = {
      establishmentId,
      memberId,
      deletedAt: null,
    };

    this.logger.debug(
      `Fetching member services with filters: establishmentId=${establishmentId}, memberId=${memberId}, deletedAt=null`,
    );

    const [data, total] = await Promise.all([
      this.prisma.memberService.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { service: true },
      }),

      this.prisma.memberService.count({ where }),
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
  ): Promise<MemberServiceModel> {
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

    return this.prisma.memberService.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteMemberService(id: string, deletedBy: string): Promise<void> {
    await this.prisma.memberService.update({
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
  ): Promise<(MemberServiceModel & { service: EstablishmentService }) | null> {
    return this.prisma.memberService.findFirst({
      where: {
        memberId,
        establishmentId,
        serviceId,
        deletedAt: null,
      },
      include: { service: true },
    });
  }
}
