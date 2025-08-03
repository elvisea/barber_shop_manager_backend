import { Injectable } from '@nestjs/common';
import { MemberProduct } from '@prisma/client';

import { IMemberProductRepository } from '../contracts/member-product-repository.interface';

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
  }): Promise<MemberProduct> {
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

  async findByMemberEstablishmentProduct(
    memberId: string,
    establishmentId: string,
    productId: string,
  ): Promise<MemberProduct | null> {
    return this.prisma.memberProduct.findFirst({
      where: {
        memberId,
        establishmentId,
        productId,
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
}
