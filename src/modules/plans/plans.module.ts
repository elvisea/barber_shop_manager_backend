import { Module } from '@nestjs/common';

import { PlanCreateController } from './controllers/plan-create.controller';
import { PlanDeleteController } from './controllers/plan-delete.controller';
import { PlanFindAllController } from './controllers/plan-find-all.controller';
import { PlanFindByIdController } from './controllers/plan-find-by-id.controller';
import { PlanUpdateController } from './controllers/plan-update.controller';
import { PlanRepository } from './repositories/plan.repository';
import { PlanCreateService } from './services/plan-create.service';
import { PlanDeleteService } from './services/plan-delete.service';
import { PlanFindAllService } from './services/plan-find-all.service';
import { PlanFindByIdService } from './services/plan-find-by-id.service';
import { PlanUpdateService } from './services/plan-update.service';

@Module({
  imports: [],
  controllers: [
    PlanCreateController,
    PlanFindAllController,
    PlanFindByIdController,
    PlanDeleteController,
    PlanUpdateController,
  ],
  providers: [
    PlanCreateService,
    PlanFindAllService,
    PlanFindByIdService,
    PlanDeleteService,
    PlanUpdateService,
    PlanRepository,
  ],
  exports: [PlanRepository],
})
export class PlansModule {}
