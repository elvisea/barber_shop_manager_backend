import { Module } from '@nestjs/common';

import { AppointmentCreateController } from './controllers/appointment-create.controller';
import { AppointmentDeleteController } from './controllers/appointment-delete.controller';
import { AppointmentFindAllController } from './controllers/appointment-find-all.controller';
import { AppointmentFindByIdController } from './controllers/appointment-find-by-id.controller';
import { AppointmentUpdateController } from './controllers/appointment-update.controller';
import { AppointmentRepository } from './repositories/appointment.repository';
import { AppointmentCreateService } from './services/appointment-create.service';
import { AppointmentDeleteService } from './services/appointment-delete.service';
import { AppointmentFindAllService } from './services/appointment-find-all.service';
import { AppointmentFindByIdService } from './services/appointment-find-by-id.service';
import { AppointmentUpdateService } from './services/appointment-update.service';

import { ErrorMessageModule } from '@/error-message/error-message.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ErrorMessageModule],
  controllers: [
    AppointmentCreateController,
    AppointmentFindAllController,
    AppointmentFindByIdController,
    AppointmentUpdateController,
    AppointmentDeleteController,
  ],
  providers: [
    AppointmentCreateService,
    AppointmentFindAllService,
    AppointmentFindByIdService,
    AppointmentUpdateService,
    AppointmentDeleteService,
    AppointmentRepository,
  ],
})
export class AppointmentsModule {}
