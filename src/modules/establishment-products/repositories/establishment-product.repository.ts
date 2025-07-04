import { Injectable } from '@nestjs/common';

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
}
