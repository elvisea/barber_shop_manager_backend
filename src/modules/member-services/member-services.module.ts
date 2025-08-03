import { Module } from '@nestjs/common';

import { EstablishmentServicesModule } from '../establishment-services/establishment-services.module';
import { MembersModule } from '../members/members.module';

import { MemberServiceCreateController } from './controllers/member-service-create.controller';
import { MemberServiceFindAllController } from './controllers/member-service-find-all.controller';
import { MemberServiceRepository } from './repositories/member-service.repository';
import { MemberServiceCreateService } from './services/member-service-create.service';
import { MemberServiceFindAllService } from './services/member-service-find-all.service';

import { EstablishmentOwnerAccessModule } from '@/shared/establishment-owner-access/establishment-owner-access.module';

@Module({
  controllers: [MemberServiceCreateController, MemberServiceFindAllController],
  providers: [
    MemberServiceRepository,
    MemberServiceCreateService,
    MemberServiceFindAllService,
  ],
  imports: [
    MembersModule,
    EstablishmentServicesModule,
    EstablishmentOwnerAccessModule,
  ],
  exports: [],
})
export class MemberServicesModule {}
