import { Injectable } from '@nestjs/common';
import { Establishment } from '@prisma/client';

import { IEstablishmentRepository } from '../contracts/establishment-repository.interface';
import { EstablishmentCreateRequestDTO } from '../dtos/establishment-create-request.dto';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class EstablishmentRepository implements IEstablishmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(establishmentId: string): Promise<Establishment | null> {
    return this.prisma.establishment.findFirst({
      where: {
        id: establishmentId,
        deletedAt: null,
      },
    });
  }

  async create(
    data: EstablishmentCreateRequestDTO,
    userId: string,
  ): Promise<Establishment> {
    // Cria o estabelecimento
    const establishment = await this.prisma.establishment.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        owner: {
          connect: { id: userId },
        },
      },
    });
    return establishment;
  }

  async findByPhoneAndUser(
    phone: string,
    ownerId: string,
  ): Promise<Establishment | null> {
    // Busca estabelecimento pelo telefone e associação do usuário
    return this.prisma.establishment.findFirst({
      where: {
        phone,
        ownerId,
        deletedAt: null,
      },
    });
  }

  async findByIdAndUser(
    establishmentId: string,
    ownerId: string,
  ): Promise<Establishment | null> {
    return this.prisma.establishment.findFirst({
      where: {
        id: establishmentId,
        ownerId,
        deletedAt: null,
      },
    });
  }

  async findByIdWithMembersAdmin(
    establishmentId: string,
  ): Promise<
    (Establishment & { members: Array<{ id: string; role: string }> }) | null
  > {
    return this.prisma.establishment.findFirst({
      where: {
        id: establishmentId,
        deletedAt: null,
      },
      include: { members: true },
    });
  }

  async findAllByUserPaginated(params: {
    userId: string;
    skip: number;
    take: number;
  }): Promise<{ data: Establishment[]; total: number }> {
    const { userId, skip, take } = params;

    const where = {
      ownerId: userId,
      deletedAt: null,
    };

    const [data, total] = await Promise.all([
      this.prisma.establishment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.establishment.count({ where }),
    ]);

    return { data, total };
  }

  async update(
    establishmentId: string,
    dto: Partial<{ name: string; address: string; phone: string }>,
  ): Promise<Establishment> {
    return this.prisma.establishment.update({
      where: { id: establishmentId },
      data: dto,
    });
  }

  async deleteByIdAndUser(
    establishmentId: string,
    userId: string,
  ): Promise<void> {
    await this.prisma.establishment.update({
      where: {
        id: establishmentId,
      },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }
}
