import { Injectable } from '@nestjs/common';

import { IEstablishmentCustomerRepository } from '../contracts/establishment-customer-repository.interface';
import { EstablishmentCustomerCreateRequestDTO } from '../dtos/establishment-customer-create-request.dto';
import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class EstablishmentCustomerRepository
  implements IEstablishmentCustomerRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async existsByEmail(
    establishmentId: string,
    email: string,
  ): Promise<boolean> {
    const count = await this.prisma.establishmentCustomer.count({
      where: { establishmentId, email },
    });
    return count > 0;
  }

  async existsByPhone(
    establishmentId: string,
    phone: string,
  ): Promise<boolean> {
    const count = await this.prisma.establishmentCustomer.count({
      where: { establishmentId, phone },
    });
    return count > 0;
  }

  async createCustomer(
    dto: EstablishmentCustomerCreateRequestDTO,
  ): Promise<EstablishmentCustomerCreateResponseDTO> {
    const customer = await this.prisma.establishmentCustomer.create({
      data: {
        establishmentId: dto.establishmentId,
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

  // Métodos CRUD serão implementados conforme os recursos forem criados
}
