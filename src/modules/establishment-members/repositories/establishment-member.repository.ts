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
}
