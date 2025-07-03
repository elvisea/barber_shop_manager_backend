import { ErrorMessageModule } from '@/error-message/error-message.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';

import { EstablishmentRepository } from './repositories/establishment.repository';

import { EstablishmentCreateController } from './controllers/establishment-create.controller';
import { EstablishmentCreateService } from './services/establishment-create.service';

@Module({
  imports: [PrismaModule, ErrorMessageModule],
  controllers: [EstablishmentCreateController],
  providers: [EstablishmentCreateService, EstablishmentRepository],
  exports: [EstablishmentRepository],
})
export class EstablishmentModule { } 