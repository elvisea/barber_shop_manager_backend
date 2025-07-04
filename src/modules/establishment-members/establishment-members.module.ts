import { Module } from '@nestjs/common';

import { EstablishmentMemberRepository } from './repositories/establishment-member.repository';

import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [PrismaService, EstablishmentMemberRepository],
  exports: [EstablishmentMemberRepository],
})
export class EstablishmentMembersModule {}
