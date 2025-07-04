import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { EstablishmentCreateController } from './controllers/establishment-create.controller';
import { EstablishmentFindAllController } from './controllers/establishment-find-all.controller';
import { EstablishmentFindOneController } from './controllers/establishment-find-one.controller';
import { EstablishmentUpdateController } from './controllers/establishment-update.controller';
import { EstablishmentRepository } from './repositories/establishment.repository';
import { EstablishmentCreateService } from './services/establishment-create.service';
import { EstablishmentFindAllService } from './services/establishment-find-all.service';
import { EstablishmentFindOneService } from './services/establishment-find-one.service';
import { EstablishmentMembershipService } from './services/establishment-membership.service';
import { EstablishmentUpdateService } from './services/establishment-update.service';

import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    EstablishmentCreateController,
    EstablishmentFindAllController,
    EstablishmentFindOneController,
    EstablishmentUpdateController,
  ],
  providers: [
    EstablishmentCreateService,
    EstablishmentFindAllService,
    EstablishmentFindOneService,
    EstablishmentUpdateService,
    EstablishmentMembershipService,
    EstablishmentRepository,
    JwtAuthGuard,
  ],
  exports: [EstablishmentRepository, EstablishmentMembershipService],
})
export class EstablishmentModule {}
