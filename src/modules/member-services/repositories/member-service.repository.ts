import { Injectable } from '@nestjs/common';
import {
  EstablishmentService,
  MemberService as MemberServiceModel,
} from '@prisma/client';

import { IMemberServiceRepository } from '../contracts/member-service-repository.interface';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MemberServiceRepository implements IMemberServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMemberService(data: {
    userId: string;
    establishmentId: string;
    serviceId: string;
    price: number;
    commission: number;
    duration: number;
  }): Promise<MemberServiceModel> {
    return this.prisma.memberService.create({
      data,
    });
  }

  async findByUserEstablishmentService(
    userId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<MemberServiceModel | null> {
    return this.prisma.memberService.findUnique({
      where: {
        userId_establishmentId_serviceId: {
          userId,
          establishmentId,
          serviceId,
        },
      },
    });
  }

  async existsByUserEstablishmentService(
    userId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<boolean> {
    const count = await this.prisma.memberService.count({
      where: {
        userId,
        establishmentId,
        serviceId,
      },
    });
    return count > 0;
  }

  async findAllByMemberPaginated({
    establishmentId,
    userId,
    skip,
    take,
  }: {
    establishmentId: string;
    userId: string;
    skip: number;
    take: number;
  }): Promise<{
    data: (MemberServiceModel & { service: EstablishmentService })[];
    total: number;
  }> {
    const [data, total] = await Promise.all([
      this.prisma.memberService.findMany({
        where: { establishmentId, userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { service: true },
      }),

      this.prisma.memberService.count({ where: { establishmentId, userId } }),
    ]);
    return { data, total };
  }
}
