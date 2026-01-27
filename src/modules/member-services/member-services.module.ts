import { Module } from '@nestjs/common';

import { MemberServiceCreateController } from './controllers/member-service-create.controller';
import { MemberServiceDeleteController } from './controllers/member-service-delete.controller';
import { MemberServiceFindAllController } from './controllers/member-service-find-all.controller';
import { MemberServiceFindOneController } from './controllers/member-service-find-one.controller';
import { MemberServiceUpdateController } from './controllers/member-service-update.controller';
import { MemberServiceRepository } from './repositories/member-service.repository';
import { MemberServiceCreateService } from './services/member-service-create.service';
import { MemberServiceDeleteService } from './services/member-service-delete.service';
import { MemberServiceFindAllService } from './services/member-service-find-all.service';
import { MemberServiceFindOneService } from './services/member-service-find-one.service';
import { MemberServiceUpdateService } from './services/member-service-update.service';
import { MemberServiceValidationService } from './services/member-service-validation.service';

import { EstablishmentModule } from '@/modules/establishment/establishment.module';
import { EstablishmentServicesModule } from '@/modules/establishment-services/establishment-services.module';
import { MembersModule } from '@/modules/members/members.module';

@Module({
  imports: [EstablishmentModule, EstablishmentServicesModule, MembersModule],
  controllers: [
    MemberServiceCreateController,
    MemberServiceFindAllController,
    MemberServiceFindOneController,
    MemberServiceUpdateController,
    MemberServiceDeleteController,
  ],
  providers: [
    MemberServiceCreateService,
    MemberServiceFindAllService,
    MemberServiceFindOneService,
    MemberServiceUpdateService,
    MemberServiceDeleteService,
    MemberServiceValidationService,
    MemberServiceRepository,
  ],
  exports: [MemberServiceRepository],
})
export class MemberServicesModule {}
