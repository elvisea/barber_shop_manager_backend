import { Module } from '@nestjs/common';

import { EstablishmentRepository } from '../establishment/repositories/establishment.repository';

import { EstablishmentProductCreateController } from './controllers/establishment-product-create.controller';
import { EstablishmentProductDeleteController } from './controllers/establishment-product-delete.controller';
import { EstablishmentProductFindAllController } from './controllers/establishment-product-find-all.controller';
import { EstablishmentProductFindByIdController } from './controllers/establishment-product-find-by-id.controller';
import { EstablishmentProductUpdateController } from './controllers/establishment-product-update.controller';
import { EstablishmentProductRepository } from './repositories/establishment-product.repository';
import { EstablishmentProductCreateService } from './services/establishment-product-create.service';
import { EstablishmentProductDeleteService } from './services/establishment-product-delete.service';
import { EstablishmentProductFindAllService } from './services/establishment-product-find-all.service';
import { EstablishmentProductFindByIdService } from './services/establishment-product-find-by-id.service';
import { EstablishmentProductUpdateService } from './services/establishment-product-update.service';

@Module({
  providers: [
    EstablishmentRepository,
    EstablishmentProductRepository,
    EstablishmentProductCreateService,
    EstablishmentProductFindByIdService,
    EstablishmentProductFindAllService,
    EstablishmentProductDeleteService,
    EstablishmentProductUpdateService,
  ],
  controllers: [
    EstablishmentProductCreateController,
    EstablishmentProductFindByIdController,
    EstablishmentProductFindAllController,
    EstablishmentProductDeleteController,
    EstablishmentProductUpdateController,
  ],
  exports: [EstablishmentProductRepository],
})
export class EstablishmentProductsModule {}
