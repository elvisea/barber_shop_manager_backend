import { Module } from '@nestjs/common';

import { EstablishmentRepository } from '../establishment/repositories/establishment.repository';

import { EstablishmentProductCreateController } from './controllers/establishment-product-create.controller';
import { EstablishmentProductFindByIdController } from './controllers/establishment-product-find-by-id.controller';
import { EstablishmentProductRepository } from './repositories/establishment-product.repository';
import { EstablishmentProductCreateService } from './services/establishment-product-create.service';
import { EstablishmentProductFindByIdService } from './services/establishment-product-find-by-id.service';

@Module({
  providers: [
    EstablishmentRepository,
    EstablishmentProductRepository,
    EstablishmentProductCreateService,
    EstablishmentProductFindByIdService,
  ],
  controllers: [
    EstablishmentProductCreateController,
    EstablishmentProductFindByIdController,
  ],
  exports: [EstablishmentProductRepository],
})
export class EstablishmentProductsModule {}
