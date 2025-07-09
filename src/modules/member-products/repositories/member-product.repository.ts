import { Injectable } from '@nestjs/common';
import { MemberProduct } from '@prisma/client';

import { IMemberProductRepository } from '../contracts/member-product-repository.interface';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MemberProductRepository implements IMemberProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMemberProduct(data: {
    userId: string;
    establishmentId: string;
    productId: string;
    price: number;
    commission: number;
  }): Promise<MemberProduct> {
    return this.prisma.memberProduct.create({
      data,
    });
  }

  async findByUserEstablishmentProduct(
    userId: string,
    establishmentId: string,
    productId: string,
  ): Promise<MemberProduct | null> {
    return this.prisma.memberProduct.findUnique({
      where: {
        userId_establishmentId_productId: {
          userId,
          establishmentId,
          productId,
        },
      },
    });
  }

  async existsByUserEstablishmentProduct(
    userId: string,
    establishmentId: string,
    productId: string,
  ): Promise<boolean> {
    const count = await this.prisma.memberProduct.count({
      where: {
        userId,
        establishmentId,
        productId,
      },
    });
    return count > 0;
  }
}
