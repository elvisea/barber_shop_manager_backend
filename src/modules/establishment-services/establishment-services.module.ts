import { Module } from '@nestjs/common';

import { EstablishmentServiceCreateController } from './controllers/establishment-service-create.controller';
import { EstablishmentServiceRepository } from './repositories/establishment-service.repository';
import { EstablishmentServiceCreateService } from './services/establishment-service-create.service';

import { ErrorMessageModule } from '@/error-message/error-message.module';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { EstablishmentModule } from '@/modules/establishment/establishment.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, EstablishmentModule, ErrorMessageModule],
  controllers: [EstablishmentServiceCreateController],
  providers: [
    EstablishmentServiceCreateService,
    EstablishmentServiceRepository,
    JwtAuthGuard,
  ],
  exports: [EstablishmentServiceCreateService, EstablishmentServiceRepository],
})
export class EstablishmentServicesModule {}
