import { Module } from '@nestjs/common';

import { EstablishmentMemberRepository } from './repositories/establishment-member.repository';

@Module({
  providers: [EstablishmentMemberRepository],
  exports: [EstablishmentMemberRepository],
})
export class EstablishmentMembersModule {}
