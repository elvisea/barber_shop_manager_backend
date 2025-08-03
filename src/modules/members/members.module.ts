import { Module } from '@nestjs/common';

import { MemberCreateController } from './controllers/member-create.controller';
import { MemberDeleteController } from './controllers/member-delete.controller';
import { MemberFindAllController } from './controllers/member-find-all.controller';
import { MemberFindByIdController } from './controllers/member-find-by-id.controller';
import { MemberUpdateController } from './controllers/member-update.controller';
import { MemberRepository } from './repositories/member.repository';
import { MemberCreateService } from './services/member-create.service';
import { MemberDeleteService } from './services/member-delete.service';
import { MemberFindAllService } from './services/member-find-all.service';
import { MemberFindByIdService } from './services/member-find-by-id.service';
import { MemberUpdateService } from './services/member-update.service';

import { EstablishmentModule } from '@/modules/establishment/establishment.module';

@Module({
  imports: [EstablishmentModule],
  controllers: [
    MemberCreateController,
    MemberFindAllController,
    MemberFindByIdController,
    MemberUpdateController,
    MemberDeleteController,
  ],
  providers: [
    MemberCreateService,
    MemberFindAllService,
    MemberFindByIdService,
    MemberUpdateService,
    MemberDeleteService,
    MemberRepository,
  ],
  exports: [MemberRepository],
})
export class MembersModule {}
