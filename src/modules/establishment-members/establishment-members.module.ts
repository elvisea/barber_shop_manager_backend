import { Module } from '@nestjs/common';

import { EstablishmentMemberCreateController } from './controllers/establishment-member-create.controller';
import { EstablishmentMemberDeleteController } from './controllers/establishment-member-delete.controller';
import { EstablishmentMemberFindAllController } from './controllers/establishment-member-find-all.controller';
import { EstablishmentMemberFindByIdController } from './controllers/establishment-member-find-by-id.controller';
import { EstablishmentMemberRepository } from './repositories/establishment-member.repository';
import { EstablishmentMemberCreateService } from './services/establishment-member-create.service';
import { EstablishmentMemberDeleteService } from './services/establishment-member-delete.service';
import { EstablishmentMemberFindAllService } from './services/establishment-member-find-all.service';
import { EstablishmentMemberFindByIdService } from './services/establishment-member-find-by-id.service';

@Module({
  providers: [
    EstablishmentMemberRepository,
    EstablishmentMemberCreateService,
    EstablishmentMemberDeleteService,
    EstablishmentMemberFindByIdService,
    EstablishmentMemberFindAllService,
  ],
  controllers: [
    EstablishmentMemberCreateController,
    EstablishmentMemberDeleteController,
    EstablishmentMemberFindByIdController,
    EstablishmentMemberFindAllController,
  ],
  exports: [EstablishmentMemberRepository],
})
export class EstablishmentMembersModule {}
