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

  async findByMemberEstablishmentService(
    memberId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<MemberServiceModel | null> {
    return this.prisma.memberService.findFirst({
      where: {
        memberId,
        establishmentId,
        serviceId,
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
    const [data, total] = await Promise.all([
      this.prisma.memberService.findMany({
        where: { establishmentId, memberId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { service: true },
      }),

      this.prisma.memberService.count({ where: { establishmentId, memberId } }),
    ]);
    return { data, total };
  }
}
