import { Module } from '@nestjs/common';

import { EstablishmentMembersModule } from '../establishment-members/establishment-members.module';
import { EstablishmentServicesModule } from '../establishment-services/establishment-services.module';

import { MemberServiceCreateController } from './controllers/member-service-create.controller';
import { MemberServiceRepository } from './repositories/member-service.repository';
import { MemberServiceCreateService } from './services/member-service-create.service';

import { ErrorMessageModule } from '@/error-message/error-message.module';
import { EstablishmentAccessModule } from '@/shared/establishment-access/establishment-access.module';

@Module({
  controllers: [MemberServiceCreateController],
  providers: [MemberServiceCreateService, MemberServiceRepository],
  imports: [
    EstablishmentMembersModule,
    EstablishmentServicesModule,
    ErrorMessageModule,
    EstablishmentAccessModule,
  ],
  exports: [],
})
export class MemberServicesModule {}
