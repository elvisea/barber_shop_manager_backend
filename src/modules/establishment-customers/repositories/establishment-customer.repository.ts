import { Injectable } from '@nestjs/common';
import { EstablishmentCustomer, Prisma } from '@prisma/client';

import { IEstablishmentCustomerRepository } from '../contracts/establishment-customer-repository.interface';
import { EstablishmentCustomerCreateRequestDTO } from '../dtos/establishment-customer-create-request.dto';
import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';

import { PrismaService } from '@/prisma/prisma.service';

type EstablishmentCustomerWithEstablishment =
  Prisma.EstablishmentCustomerGetPayload<{
    include: { establishment: true };
  }>;

@Injectable()
export class EstablishmentCustomerRepository implements IEstablishmentCustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByEmail(
    establishmentId: string,
    email: string,
  ): Promise<boolean> {
    const count = await this.prisma.establishmentCustomer.count({
      where: { establishmentId, email, deletedAt: null },
    });
    return count > 0;
  }

  async existsByPhone(
    establishmentId: string,
    phone: string,
  ): Promise<boolean> {
    const count = await this.prisma.establishmentCustomer.count({
      where: { establishmentId, phone, deletedAt: null },
    });
    return count > 0;
  }

  async createCustomer(
    dto: Omit<EstablishmentCustomerCreateRequestDTO, 'establishmentId'>,
    establishmentId: string,
  ): Promise<EstablishmentCustomerCreateResponseDTO> {
    const customer = await this.prisma.establishmentCustomer.create({
      data: {
        establishmentId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
      },
    });
    return {
      ...customer,
      email: customer.email || undefined,
      phone: customer.phone || undefined,
    };
  }

  async findByIdAndEstablishment(
    customerId: string,
    establishmentId: string,
  ): Promise<EstablishmentCustomer | null> {
    return this.prisma.establishmentCustomer.findFirst({
      where: { id: customerId, establishmentId, deletedAt: null },
    });
  }

  async findByIdWithEstablishment(
    customerId: string,
  ): Promise<EstablishmentCustomerWithEstablishment | null> {
    return this.prisma.establishmentCustomer.findFirst({
      where: { id: customerId, deletedAt: null },
      include: { establishment: true },
    });
  }

  async findByEmailAndEstablishment(
    establishmentId: string,
    email: string,
  ): Promise<EstablishmentCustomer | null> {
    return this.prisma.establishmentCustomer.findFirst({
      where: { establishmentId, email, deletedAt: null },
    });
  }

  async findByPhoneAndEstablishment(
    establishmentId: string,
    phone: string,
  ): Promise<EstablishmentCustomer | null> {
    return this.prisma.establishmentCustomer.findFirst({
      where: { establishmentId, phone, deletedAt: null },
    });
  }

  async findAllByEstablishmentPaginated({
    establishmentId,
    skip,
    take,
  }: {
    establishmentId: string;
    skip: number;
    take: number;
  }) {
    const [data, total] = await Promise.all([
      this.prisma.establishmentCustomer.findMany({
        where: { establishmentId, deletedAt: null },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.establishmentCustomer.count({
        where: { establishmentId, deletedAt: null },
      }),
    ]);
    return { data, total };
  }

  async deleteByIdAndEstablishment(
    customerId: string,
    establishmentId: string,
    deletedByUserId: string,
  ): Promise<void> {
    await this.prisma.establishmentCustomer.update({
      where: {
        id: customerId,
        establishmentId,
      },
      data: {
        deletedAt: new Date(),
        deletedBy: deletedByUserId,
      },
    });
  }

  async updateByIdAndEstablishment(
    customerId: string,
    establishmentId: string,
    dto: Partial<{
      name: string;
      email?: string | null;
      phone?: string | null;
    }>,
  ): Promise<EstablishmentCustomer> {
    return this.prisma.establishmentCustomer.update({
      where: {
        id: customerId,
        establishmentId,
      },
      data: dto,
    });
  }

  async updateById(
    customerId: string,
    dto: Partial<{
      name: string;
      email?: string | null;
      phone?: string | null;
    }>,
  ): Promise<EstablishmentCustomer> {
    return this.prisma.establishmentCustomer.update({
      where: { id: customerId },
      data: dto,
    });
  }

  async deleteById(customerId: string, deletedByUserId: string): Promise<void> {
    await this.prisma.establishmentCustomer.update({
      where: { id: customerId },
      data: {
        deletedAt: new Date(),
        deletedBy: deletedByUserId,
      },
    });
  }

  // Métodos CRUD serão implementados conforme os recursos forem criados
}
