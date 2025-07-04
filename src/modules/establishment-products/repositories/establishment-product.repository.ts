import { Injectable } from '@nestjs/common';
import { EstablishmentProduct } from '@prisma/client';

import { EstablishmentProductCreateRequestDTO } from '../dtos/establishment-product-create-request.dto';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class EstablishmentProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByName(establishmentId: string, name: string): Promise<boolean> {
    const count = await this.prisma.establishmentProduct.count({
      where: { establishmentId, name },
    });
    return count > 0;
  }

  async createProduct(
    dto: EstablishmentProductCreateRequestDTO,
    establishmentId: string,
  ) {
    return this.prisma.establishmentProduct.create({
      data: {
        ...dto,
        establishmentId,
      },
    });
  }

  async findByIdAndEstablishment(productId: string, establishmentId: string) {
    return this.prisma.establishmentProduct.findFirst({
      where: {
        id: productId,
        establishmentId,
      },
    });
  }

  async findAllByEstablishmentPaginated(params: {
    establishmentId: string;
    skip: number;
    take: number;
  }): Promise<{ data: EstablishmentProduct[]; total: number }> {
    const { establishmentId, skip, take } = params;

    const [data, total] = await Promise.all([
      this.prisma.establishmentProduct.findMany({
        where: { establishmentId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.establishmentProduct.count({ where: { establishmentId } }),
    ]);

    return { data, total };
  }

  async deleteByIdAndEstablishment(
    productId: string,
    establishmentId: string,
  ): Promise<void> {
    await this.prisma.establishmentProduct.delete({
      where: {
        id: productId,
        establishmentId,
      },
    });
  }

  async updateByIdAndEstablishment(
    productId: string,
    establishmentId: string,
    dto: Partial<{
      name: string;
      description?: string;
      price: number;
      commission: number;
      stock: number;
    }>,
  ) {
    return this.prisma.establishmentProduct.update({
      where: {
        id: productId,
        establishmentId,
      },
      data: dto,
    });
  }
}
