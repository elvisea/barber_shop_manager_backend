import { Module } from '@nestjs/common';

import { MeCustomersController } from './controllers/me-customers.controller';
import { MeEstablishmentsController } from './controllers/me-establishments.controller';
import { MeMembersController } from './controllers/me-members.controller';
import { MeProductsController } from './controllers/me-products.controller';
import { MeServicesController } from './controllers/me-services.controller';
import { MeCustomersService } from './services/me-customers.service';
import { MeEstablishmentsService } from './services/me-establishments.service';
import { MeMembersService } from './services/me-members.service';
import { MeProductsService } from './services/me-products.service';
import { MeServicesService } from './services/me-services.service';

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
    MeServicesController,
    MeCustomersController,
    MeMembersController,
  ],
  providers: [
    MeEstablishmentsService,
    MeProductsService,
    MeServicesService,
    MeCustomersService,
    MeMembersService,
  ],
})
export class MeModule {}
