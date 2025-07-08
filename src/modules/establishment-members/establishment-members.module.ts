import { Module } from '@nestjs/common';

import { EstablishmentMemberCreateController } from './controllers/establishment-member-create.controller';
import { EstablishmentMemberDeleteController } from './controllers/establishment-member-delete.controller';
import { EstablishmentMemberRepository } from './repositories/establishment-member.repository';
import { EstablishmentMemberCreateService } from './services/establishment-member-create.service';
import { EstablishmentMemberDeleteService } from './services/establishment-member-delete.service';

@Module({
  providers: [
    EstablishmentMemberRepository,
    EstablishmentMemberCreateService,
    EstablishmentMemberDeleteService,
  ],
  controllers: [
    EstablishmentMemberCreateController,
    EstablishmentMemberDeleteController,
  ],
  exports: [EstablishmentMemberRepository],
})
export class EstablishmentMembersModule {}
