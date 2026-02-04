import { Injectable } from '@nestjs/common';
import {
  EstablishmentProduct,
  UserProduct as UserProductModel,
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
  }): Promise<UserProductModel> {
    return this.prisma.userProduct.create({
      data: {
        price: data.price,
        commission: data.commission,
        establishmentId: data.establishmentId,
        productId: data.productId,
        userId: data.memberId,
      },
    });
  }

  async findByMemberEstablishmentProductWithRelations(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<MemberProductWithRelations | null> {
    return this.prisma.userProduct.findFirst({
      where: {
        userId: memberId,
        establishmentId,
        productId,
      },
      include: {
        user: true,
        product: {
          include: {
            establishment: true,
          },
        },
      },
    });
  }

  async existsByMemberEstablishmentProduct(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<boolean> {
    const count = await this.prisma.userProduct.count({
      where: {
        userId: memberId,
        establishmentId,
        productId,
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
    data: (UserProductModel & { product: EstablishmentProduct })[];
    total: number;
  }> {
    const [data, total] = await Promise.all([
      this.prisma.userProduct.findMany({
        where: { establishmentId, userId: memberId, deletedAt: null },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { product: true },
      }),
      this.prisma.userProduct.count({
        where: { establishmentId, userId: memberId, deletedAt: null },
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
  ): Promise<UserProductModel> {
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

    return this.prisma.userProduct.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteMemberProduct(id: string, deletedBy: string): Promise<void> {
    await this.prisma.userProduct.update({
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
  ): Promise<(UserProductModel & { product: EstablishmentProduct }) | null> {
    return this.prisma.userProduct.findFirst({
      where: {
        userId: memberId,
        establishmentId,
        productId,
        deletedAt: null,
      },
      include: { product: true },
    });
  }

  async findOneByMemberEstablishmentProductIncludingDeleted(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<UserProductModel | null> {
    return this.prisma.userProduct.findFirst({
      where: {
        userId: memberId,
        establishmentId,
        productId,
      },
    });
  }

  async restoreMemberProduct(
    id: string,
    data: { price: number; commission: number },
  ): Promise<UserProductModel> {
    return this.prisma.userProduct.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        price: data.price,
        commission: data.commission,
      },
    });
  }
}
