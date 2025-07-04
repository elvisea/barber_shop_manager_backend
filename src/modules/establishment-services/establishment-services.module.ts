import { Module } from '@nestjs/common';

import { EstablishmentModule } from '../establishment/establishment.module';

import { EstablishmentServiceCreateController } from './controllers/establishment-service-create.controller';
import { EstablishmentServiceDeleteController } from './controllers/establishment-service-delete.controller';
import { EstablishmentServiceFindAllController } from './controllers/establishment-service-find-all.controller';
import { EstablishmentServiceFindByIdController } from './controllers/establishment-service-find-by-id.controller';
import { EstablishmentServiceRepository } from './repositories/establishment-service.repository';
import { EstablishmentServiceCreateService } from './services/establishment-service-create.service';
import { EstablishmentServiceDeleteService } from './services/establishment-service-delete.service';
import { EstablishmentServiceFindAllService } from './services/establishment-service-find-all.service';
import { EstablishmentServiceFindByIdService } from './services/establishment-service-find-by-id.service';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [EstablishmentModule],
  controllers: [
    EstablishmentServiceCreateController,
    EstablishmentServiceFindAllController,
    EstablishmentServiceFindByIdController,
    EstablishmentServiceDeleteController,
  ],
  providers: [
    EstablishmentServiceCreateService,
    EstablishmentServiceFindAllService,
    EstablishmentServiceFindByIdService,
    EstablishmentServiceRepository,
    JwtAuthGuard,
    EstablishmentServiceDeleteService,
  ],
  exports: [EstablishmentServiceCreateService, EstablishmentServiceRepository],
})
export class EstablishmentServicesModule { }
