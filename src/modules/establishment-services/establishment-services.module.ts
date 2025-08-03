import { Module } from '@nestjs/common';

import { EstablishmentServiceCreateController } from './controllers/establishment-service-create.controller';
import { EstablishmentServiceDeleteController } from './controllers/establishment-service-delete.controller';
import { EstablishmentServiceFindAllController } from './controllers/establishment-service-find-all.controller';
import { EstablishmentServiceFindByIdController } from './controllers/establishment-service-find-by-id.controller';
import { EstablishmentServiceUpdateController } from './controllers/establishment-service-update.controller';
import { EstablishmentServiceRepository } from './repositories/establishment-service.repository';
import { EstablishmentServiceCreateService } from './services/establishment-service-create.service';
import { EstablishmentServiceDeleteService } from './services/establishment-service-delete.service';
import { EstablishmentServiceFindAllService } from './services/establishment-service-find-all.service';
import { EstablishmentServiceFindByIdService } from './services/establishment-service-find-by-id.service';
import { EstablishmentServiceUpdateService } from './services/establishment-service-update.service';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { EstablishmentModule } from '@/modules/establishment/establishment.module';

@Module({
  imports: [EstablishmentModule],
  controllers: [
    EstablishmentServiceCreateController,
    EstablishmentServiceFindAllController,
    EstablishmentServiceFindByIdController,
    EstablishmentServiceDeleteController,
    EstablishmentServiceUpdateController,
  ],
  providers: [
    EstablishmentServiceCreateService,
    EstablishmentServiceFindAllService,
    EstablishmentServiceFindByIdService,
    EstablishmentServiceRepository,
    JwtAuthGuard,
    EstablishmentServiceDeleteService,
    EstablishmentServiceUpdateService,
  ],
  exports: [EstablishmentServiceCreateService, EstablishmentServiceRepository],
})
export class EstablishmentServicesModule {}
