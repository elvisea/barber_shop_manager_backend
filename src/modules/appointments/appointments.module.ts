import { Module } from '@nestjs/common';

import { AppointmentCreateController } from './controllers/appointment-create.controller';
import { AppointmentDeleteController } from './controllers/appointment-delete.controller';
import { AppointmentFindAllController } from './controllers/appointment-find-all.controller';
import { AppointmentFindByIdController } from './controllers/appointment-find-by-id.controller';
import { AppointmentUpdateController } from './controllers/appointment-update.controller';
import { AppointmentRepository } from './repositories/appointment.repository';
import { AppointmentAccessValidationService } from './services/appointment-access-validation.service';
import { AppointmentCreateService } from './services/appointment-create.service';
import { AppointmentDeleteService } from './services/appointment-delete.service';
import { AppointmentFindAllService } from './services/appointment-find-all.service';
import { AppointmentFindByIdService } from './services/appointment-find-by-id.service';
import { AppointmentUpdateService } from './services/appointment-update.service';

import { EstablishmentCustomerModule } from '@/modules/establishment-customers/establishment-customer.module';
import { EstablishmentServicesModule } from '@/modules/establishment-services/establishment-services.module';
import { EstablishmentModule } from '@/modules/establishment/establishment.module';
import { MemberServicesModule } from '@/modules/member-services/member-services.module';
import { MembersModule } from '@/modules/members/members.module';

@Module({
  imports: [
    EstablishmentModule,
    EstablishmentCustomerModule,
    EstablishmentServicesModule,
    MemberServicesModule,
    MembersModule,
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
    AppointmentCreateService,
    AppointmentFindAllService,
    AppointmentFindByIdService,
    AppointmentUpdateService,
    AppointmentDeleteService,
    AppointmentRepository,
  ],
})
export class AppointmentsModule { }
