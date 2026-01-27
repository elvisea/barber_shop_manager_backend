import { Injectable } from '@nestjs/common';
import {
  EstablishmentProduct,
  MemberProduct as MemberProductModel,
} from '@prisma/client';

import { IMemberProductRepository } from '../contracts/member-product-repository.interface';
import { MemberProductWithRelations } from '../types/member-product-with-relations.type';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MemberProductRepository implements IMemberProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMemberProduct(data: {
    memberId: string;
    establishmentId: string;
    productId: string;
    price: number;
    commission: number;
  }): Promise<MemberProductModel> {
    return this.prisma.memberProduct.create({
      data: {
        price: data.price,
        commission: data.commission,
        establishmentId: data.establishmentId,
        productId: data.productId,
        memberId: data.memberId,
      },
    });
  }

  async findByMemberEstablishmentProductWithRelations(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<MemberProductWithRelations | null> {
    return this.prisma.memberProduct.findFirst({
      where: {
        memberId,
        establishmentId,
        productId,
      },
      include: {
        member: {
          include: {
            establishment: true,
          },
        },
        product: true,
      },
    });
  }

  async existsByMemberEstablishmentProduct(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<boolean> {
    const count = await this.prisma.memberProduct.count({
      where: {
        memberId,
        establishmentId,
        productId,
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
    data: (MemberProductModel & { product: EstablishmentProduct })[];
    total: number;
  }> {
    const [data, total] = await Promise.all([
      this.prisma.memberProduct.findMany({
        where: { establishmentId, memberId, deletedAt: null },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { product: true },
      }),
      this.prisma.memberProduct.count({
        where: { establishmentId, memberId, deletedAt: null },
      }),
    ]);
    return { data, total };
  }

  async updateMemberProduct(
    id: string,
    data: {
      price?: number;
      commission?: number;
    },
  ): Promise<MemberProductModel> {
    const updateData: {
      price?: number;
      commission?: number;
    } = {};

    if (data.price !== undefined) {
      updateData.price = data.price;
    }
    if (data.commission !== undefined) {
      updateData.commission = data.commission;
    }

    return this.prisma.memberProduct.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteMemberProduct(id: string, deletedBy: string): Promise<void> {
    await this.prisma.memberProduct.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }

  async findOneByMemberProduct(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<(MemberProductModel & { product: EstablishmentProduct }) | null> {
    return this.prisma.memberProduct.findFirst({
      where: {
        memberId,
        establishmentId,
        productId,
        deletedAt: null,
      },
      include: { product: true },
    });
  }
}
