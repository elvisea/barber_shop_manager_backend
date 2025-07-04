import { Module } from '@nestjs/common';

import { EstablishmentServiceCreateController } from './controllers/establishment-service-create.controller';
import { EstablishmentServiceFindAllController } from './controllers/establishment-service-find-all.controller';
import { EstablishmentServiceFindByIdController } from './controllers/establishment-service-find-by-id.controller';
import { EstablishmentServiceRepository } from './repositories/establishment-service.repository';
import { EstablishmentServiceCreateService } from './services/establishment-service-create.service';
import { EstablishmentServiceFindAllService } from './services/establishment-service-find-all.service';
import { EstablishmentServiceFindByIdService } from './services/establishment-service-find-by-id.service';

import { ErrorMessageModule } from '@/error-message/error-message.module';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { EstablishmentModule } from '@/modules/establishment/establishment.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, EstablishmentModule, ErrorMessageModule],
  controllers: [
    EstablishmentServiceCreateController,
    EstablishmentServiceFindAllController,
    EstablishmentServiceFindByIdController,
  ],
  providers: [
    EstablishmentServiceCreateService,
    EstablishmentServiceFindAllService,
    EstablishmentServiceFindByIdService,
    EstablishmentServiceRepository,
    JwtAuthGuard,
  ],
  exports: [EstablishmentServiceCreateService, EstablishmentServiceRepository],
})
export class EstablishmentServicesModule {}
