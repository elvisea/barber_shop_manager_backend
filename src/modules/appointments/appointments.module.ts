import { Module } from '@nestjs/common';

import { APPOINTMENT_CREATE_BUSINESS_RULES } from './constants/appointment-create-rules.token';
import { AppointmentCreateController } from './controllers/appointment-create.controller';
import { AppointmentDeleteController } from './controllers/appointment-delete.controller';
import { AppointmentFindAllController } from './controllers/appointment-find-all.controller';
import { AppointmentFindByIdController } from './controllers/appointment-find-by-id.controller';
import { AppointmentUpdateController } from './controllers/appointment-update.controller';
import { AppointmentRepository } from './repositories/appointment.repository';
import { ValidateMemberServicesRule } from './rules/validate-member-services.rule';
import { AppointmentAccessValidationService } from './services/appointment-access-validation.service';
import { AppointmentCreateBusinessRulesService } from './services/appointment-create-business-rules.service';
import { AppointmentCreateService } from './services/appointment-create.service';
import { AppointmentDeleteService } from './services/appointment-delete.service';
import { AppointmentFindAllService } from './services/appointment-find-all.service';
import { AppointmentFindByIdService } from './services/appointment-find-by-id.service';
import { AppointmentUpdateBusinessRulesService } from './services/appointment-update-business-rules.service';
import { AppointmentUpdateService } from './services/appointment-update.service';

import { EstablishmentModule } from '@/modules/establishment/establishment.module';
import { EstablishmentCustomerModule } from '@/modules/establishment-customers/establishment-customer.module';
import { EstablishmentServicesModule } from '@/modules/establishment-services/establishment-services.module';
import { UserEstablishmentsModule } from '@/modules/user-establishments/user-establishments.module';
import { EstablishmentAccessModule } from '@/shared/establishment-access/establishment-access.module';

@Module({
  imports: [
    EstablishmentAccessModule,
    EstablishmentModule,
    EstablishmentCustomerModule,
    EstablishmentServicesModule,
    UserEstablishmentsModule,
  ],
  controllers: [
    AppointmentCreateController,
    AppointmentFindAllController,
    AppointmentFindByIdController,
    AppointmentUpdateController,
    AppointmentDeleteController,
  ],
  providers: [
    AppointmentAccessValidationService,
    AppointmentCreateBusinessRulesService,
    AppointmentCreateService,
    AppointmentUpdateBusinessRulesService,
    AppointmentFindAllService,
    AppointmentFindByIdService,
    AppointmentUpdateService,
    AppointmentDeleteService,
    AppointmentRepository,
    ValidateMemberServicesRule,
    {
      provide: APPOINTMENT_CREATE_BUSINESS_RULES,
      useFactory: (validateMemberServicesRule: ValidateMemberServicesRule) => [
        validateMemberServicesRule,
      ],
      inject: [ValidateMemberServicesRule],
    },
  ],
})
export class AppointmentsModule {}
