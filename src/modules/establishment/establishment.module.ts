import { Module } from '@nestjs/common';

import { EstablishmentCreateController } from './controllers/establishment-create.controller';
import { EstablishmentDeleteController } from './controllers/establishment-delete.controller';
import { EstablishmentEvolutionApiCreateInstanceController } from './controllers/establishment-evolution-api-create-instance.controller';
import { EstablishmentFindAllController } from './controllers/establishment-find-all.controller';
import { EstablishmentFindOneController } from './controllers/establishment-find-one.controller';
import { EstablishmentUpdateController } from './controllers/establishment-update.controller';
import { EstablishmentRepository } from './repositories/establishment.repository';
import { EstablishmentCreateService } from './services/establishment-create.service';
import { EstablishmentDeleteService } from './services/establishment-delete.service';
import { EstablishmentEvolutionApiCreateInstanceService } from './services/establishment-evolution-api-create-instance.service';
import { EstablishmentFindAllService } from './services/establishment-find-all.service';
import { EstablishmentFindOneService } from './services/establishment-find-one.service';
import { EstablishmentUpdateService } from './services/establishment-update.service';
import { EvolutionApiInstanceService } from './services/evolution-api-instance.service';
import { EvolutionApiWebhookService } from './services/evolution-api-webhook.service';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Module({
  controllers: [
    EstablishmentCreateController,
    EstablishmentFindAllController,
    EstablishmentFindOneController,
    EstablishmentUpdateController,
    EstablishmentDeleteController,
    EstablishmentEvolutionApiCreateInstanceController,
  ],
  providers: [
    EstablishmentCreateService,
    EstablishmentFindAllService,
    EstablishmentFindOneService,
    EstablishmentUpdateService,
    EstablishmentDeleteService,
    EstablishmentEvolutionApiCreateInstanceService,
    EvolutionApiInstanceService,
    EvolutionApiWebhookService,
    EstablishmentRepository,
    JwtAuthGuard,
  ],
  exports: [
    EstablishmentRepository,
    EvolutionApiInstanceService,
    EvolutionApiWebhookService,
  ],
})
export class EstablishmentModule {}
