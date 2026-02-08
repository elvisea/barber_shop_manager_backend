import { Module } from '@nestjs/common';

import { MeCustomersController } from './controllers/me-customers.controller';
import { MeEstablishmentsController } from './controllers/me-establishments.controller';
import { MeProductsController } from './controllers/me-products.controller';
import { MeCustomersService } from './services/me-customers.service';
import { MeEstablishmentsService } from './services/me-establishments.service';
import { MeProductsService } from './services/me-products.service';

import { EstablishmentModule } from '@/modules/establishment/establishment.module';
import { EstablishmentCustomerModule } from '@/modules/establishment-customers/establishment-customer.module';
import { EstablishmentProductsModule } from '@/modules/establishment-products/establishment-products.module';
import { EstablishmentServicesModule } from '@/modules/establishment-services/establishment-services.module';
import { UserEstablishmentsModule } from '@/modules/user-establishments/user-establishments.module';
import { EstablishmentAccessModule } from '@/shared/establishment-access/establishment-access.module';

@Module({
  imports: [
    EstablishmentAccessModule,
    EstablishmentModule,
    UserEstablishmentsModule,
    EstablishmentProductsModule,
    EstablishmentServicesModule,
    EstablishmentCustomerModule,
  ],
  controllers: [
    MeEstablishmentsController,
    MeProductsController,
    MeCustomersController,
  ],
  providers: [MeEstablishmentsService, MeProductsService, MeCustomersService],
})
export class MeModule {}
