import { Module } from '@nestjs/common';

import { AppointmentCreateController } from './controllers/appointment-create.controller';
import { AppointmentDeleteController } from './controllers/appointment-delete.controller';
import { AppointmentFindAllController } from './controllers/appointment-find-all.controller';
import { AppointmentFindByIdController } from './controllers/appointment-find-by-id.controller';
import { AppointmentUpdateController } from './controllers/appointment-update.controller';
import { AppointmentRepository } from './repositories/appointment.repository';
import { AppointmentAccessValidationService } from './services/appointment-access-validation.service';
import { AppointmentBusinessRulesService } from './services/appointment-business-rules.service';
import { AppointmentCreateService } from './services/appointment-create.service';
import { AppointmentDeleteService } from './services/appointment-delete.service';
import { AppointmentFindAllService } from './services/appointment-find-all.service';
import { AppointmentFindByIdService } from './services/appointment-find-by-id.service';
import { AppointmentUpdateService } from './services/appointment-update.service';

import { EstablishmentModule } from '@/modules/establishment/establishment.module';
import { EstablishmentCustomerModule } from '@/modules/establishment-customers/establishment-customer.module';
import { EstablishmentServicesModule } from '@/modules/establishment-services/establishment-services.module';
import { UserEstablishmentsModule } from '@/modules/user-establishments/user-establishments.module';

@Module({
  imports: [
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
    AppointmentBusinessRulesService,
    AppointmentCreateService,
    AppointmentFindAllService,
    AppointmentFindByIdService,
    AppointmentUpdateService,
    AppointmentDeleteService,
    AppointmentRepository,
  ],
})
export class AppointmentsModule {}
