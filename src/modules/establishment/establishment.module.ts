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
import { EstablishmentUpdateService } from './services/establishment-update.service';

@Module({
  imports: [],
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
    EstablishmentRepository,
    JwtAuthGuard,
  ],
  exports: [EstablishmentRepository],
})
export class EstablishmentModule {}
