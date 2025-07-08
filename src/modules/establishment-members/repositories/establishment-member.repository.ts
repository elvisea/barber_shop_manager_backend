import { Injectable } from '@nestjs/common';
import { Establishment, EstablishmentMember, Role } from '@prisma/client';

import { IEstablishmentMemberRepository } from '../contracts/establishment-member-repository.interface';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class EstablishmentMemberRepository
  implements IEstablishmentMemberRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findEstablishmentByIdAndAdmin(
    establishmentId: string,
    userId: string,
  ): Promise<(EstablishmentMember & { establishment: Establishment }) | null> {
    return this.prisma.establishmentMember.findFirst({
      where: {
        establishmentId,
        userId,
        role: Role.ADMIN,
      },
      include: { establishment: true },
    });
  }

  async createMember(data: {
    userId: string;
    establishmentId: string;
    role: Role;
  }): Promise<EstablishmentMember> {
    return this.prisma.establishmentMember.create({
      data: {
        userId: data.userId,
        establishmentId: data.establishmentId,
        role: data.role,
      },
    });
  }

  async existsByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<boolean> {
    const count = await this.prisma.establishmentMember.count({
      where: { userId, establishmentId },
    });
    return count > 0;
  }

  async deleteByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<void> {
    await this.prisma.establishmentMember.delete({
      where: {
        userId_establishmentId: {
          userId,
          establishmentId,
        },
      },
    });
  }
}
