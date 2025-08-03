import { Module } from '@nestjs/common';

import { EstablishmentModule } from '../establishment/establishment.module';

import { SubscriptionCreateController } from './controllers/subscription-create.controller';
import { SubscriptionDeleteController } from './controllers/subscription-delete.controller';
import { SubscriptionFindAllController } from './controllers/subscription-find-all.controller';
import { SubscriptionFindByIdController } from './controllers/subscription-find-by-id.controller';
import { SubscriptionUpdateController } from './controllers/subscription-update.controller';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { SubscriptionCreateService } from './services/subscription-create.service';
import { SubscriptionDeleteService } from './services/subscription-delete.service';
import { SubscriptionFindAllService } from './services/subscription-find-all.service';
import { SubscriptionFindByIdService } from './services/subscription-find-by-id.service';
import { SubscriptionUpdateService } from './services/subscription-update.service';

@Module({
  imports: [EstablishmentModule],
  controllers: [
    SubscriptionCreateController,
    SubscriptionFindAllController,
    SubscriptionFindByIdController,
    SubscriptionUpdateController,
    SubscriptionDeleteController,
  ],
  providers: [
    SubscriptionCreateService,
    SubscriptionFindAllService,
    SubscriptionFindByIdService,
    SubscriptionUpdateService,
    SubscriptionDeleteService,
    SubscriptionRepository,
  ],
  exports: [SubscriptionRepository],
})
export class SubscriptionsModule {}
