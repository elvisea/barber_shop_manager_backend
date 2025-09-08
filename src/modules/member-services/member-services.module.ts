import { Module } from '@nestjs/common';

import { MemberServiceCreateController } from './controllers/member-service-create.controller';
import { MemberServiceFindAllController } from './controllers/member-service-find-all.controller';
import { MemberServiceRepository } from './repositories/member-service.repository';
import { MemberServiceCreateService } from './services/member-service-create.service';
import { MemberServiceFindAllService } from './services/member-service-find-all.service';

import { EstablishmentModule } from '@/modules/establishment/establishment.module';
import { EstablishmentServicesModule } from '@/modules/establishment-services/establishment-services.module';
import { MembersModule } from '@/modules/members/members.module';

@Module({
  imports: [EstablishmentModule, EstablishmentServicesModule, MembersModule],
  controllers: [MemberServiceCreateController, MemberServiceFindAllController],
  providers: [
    MemberServiceCreateService,
    MemberServiceFindAllService,
    MemberServiceRepository,
  ],
  exports: [MemberServiceRepository],
})
export class MemberServicesModule {}
