import { Injectable } from '@nestjs/common';
import { EstablishmentService } from '@prisma/client';

import { IEstablishmentServiceRepository } from '../contracts/establishment-service-repository.interface';
import { EstablishmentServiceCreateRequestDTO } from '../dtos/establishment-service-create-request.dto';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class EstablishmentServiceRepository
  implements IEstablishmentServiceRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createService(
    data: EstablishmentServiceCreateRequestDTO,
    establishmentId: string,
  ): Promise<EstablishmentService> {
    return this.prisma.establishmentService.create({
      data: {
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        commission: data.commission,
        establishment: { connect: { id: establishmentId } },
      },
    });
  }

  async findByIdAndEstablishment(
    serviceId: string,
    establishmentId: string,
  ): Promise<EstablishmentService | null> {
    return this.prisma.establishmentService.findFirst({
      where: {
        id: serviceId,
        establishmentId,
      },
    });
  }

  async findAllByEstablishmentPaginated(params: {
    establishmentId: string;
    skip: number;
    take: number;
  }): Promise<{ data: EstablishmentService[]; total: number }> {
    const [data, total] = await Promise.all([
      this.prisma.establishmentService.findMany({
        where: { establishmentId: params.establishmentId },
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.establishmentService.count({
        where: { establishmentId: params.establishmentId },
      }),
    ]);

    return { data, total };
  }

  async updateService(
    serviceId: string,
    establishmentId: string,
    data: Partial<EstablishmentServiceCreateRequestDTO>,
  ): Promise<EstablishmentService> {
    return this.prisma.establishmentService.update({
      where: {
        id: serviceId,
        establishmentId,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.duration && { duration: data.duration }),
        ...(data.price && { price: data.price }),
        ...(data.commission && { commission: data.commission }),
      },
    });
  }

  async deleteService(
    serviceId: string,
    establishmentId: string,
  ): Promise<void> {
    await this.prisma.establishmentService.delete({
      where: {
        id: serviceId,
        establishmentId,
      },
    });
  }

  async existsByName(establishmentId: string, name: string): Promise<boolean> {
    const count = await this.prisma.establishmentService.count({
      where: {
        establishmentId,
        name: { equals: name, mode: 'insensitive' },
      },
    });
    return count > 0;
  }
}
