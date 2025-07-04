import { Module } from '@nestjs/common';

import { EstablishmentCreateController } from './controllers/establishment-create.controller';
import { EstablishmentFindController } from './controllers/establishment-find.controller';
import { EstablishmentRepository } from './repositories/establishment.repository';
import { EstablishmentCreateService } from './services/establishment-create.service';
import { EstablishmentFindService } from './services/establishment-find.service';

import { ErrorMessageModule } from '@/error-message/error-message.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ErrorMessageModule],
  controllers: [EstablishmentCreateController, EstablishmentFindController],
  providers: [
    EstablishmentCreateService,
    EstablishmentFindService,
    EstablishmentRepository,
  ],
  exports: [EstablishmentRepository],
})
export class EstablishmentModule {}
