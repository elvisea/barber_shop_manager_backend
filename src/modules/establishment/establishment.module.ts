import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { EstablishmentCreateController } from './controllers/establishment-create.controller';
import { EstablishmentFindController } from './controllers/establishment-find.controller';
import { EstablishmentUpdateController } from './controllers/establishment-update.controller';
import { EstablishmentRepository } from './repositories/establishment.repository';
import { EstablishmentCreateService } from './services/establishment-create.service';
import { EstablishmentFindService } from './services/establishment-find.service';
import { EstablishmentMembershipService } from './services/establishment-membership.service';
import { EstablishmentUpdateService } from './services/establishment-update.service';

import { ErrorMessageModule } from '@/error-message/error-message.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ErrorMessageModule],
  controllers: [
    EstablishmentCreateController,
    EstablishmentFindController,
    EstablishmentUpdateController,
  ],
  providers: [
    EstablishmentCreateService,
    EstablishmentFindService,
    EstablishmentUpdateService,
    EstablishmentMembershipService,
    EstablishmentRepository,
    JwtAuthGuard,
  ],
  exports: [EstablishmentRepository],
})
export class EstablishmentModule {}
