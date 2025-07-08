import { Module } from '@nestjs/common';

import { EstablishmentMemberCreateController } from './controllers/establishment-member-create.controller';
import { EstablishmentMemberRepository } from './repositories/establishment-member.repository';
import { EstablishmentMemberCreateService } from './services/establishment-member-create.service';

@Module({
  providers: [EstablishmentMemberRepository, EstablishmentMemberCreateService],
  controllers: [EstablishmentMemberCreateController],
  exports: [EstablishmentMemberRepository],
})
export class EstablishmentMembersModule {}
