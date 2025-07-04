import { Injectable } from '@nestjs/common';
import { Establishment } from '@prisma/client';

import { IEstablishmentRepository } from '../contracts/establishment-repository.interface';
import { CreateEstablishmentRequestDTO } from '../dtos/create-establishment-request.dto';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class EstablishmentRepository implements IEstablishmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateEstablishmentRequestDTO,
    userId: string,
  ): Promise<Establishment> {
    // Cria o estabelecimento e já associa o usuário como ADMIN
    const establishment = await this.prisma.establishment.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        members: {
          create: [
            {
              userId,
              role: 'ADMIN',
            },
          ],
        },
      },
    });
    return establishment;
  }

  async findByPhoneAndUser(
    phone: string,
    userId: string,
  ): Promise<Establishment | null> {
    // Busca estabelecimento pelo telefone e associação do usuário
    return this.prisma.establishment.findFirst({
      where: {
        phone,
        members: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async findByIdAndUser(
    establishmentId: string,
    userId: string,
  ): Promise<Establishment | null> {
    return this.prisma.establishment.findFirst({
      where: {
        id: establishmentId,
        members: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async findAllByUserPaginated(params: {
    userId: string;
    skip: number;
    take: number;
  }): Promise<{ data: Establishment[]; total: number }> {
    const { userId, skip, take } = params;

    const where = {
      members: {
        some: { userId },
      },
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
}
