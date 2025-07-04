import { Module } from '@nestjs/common';

import { EstablishmentRepository } from '../establishment/repositories/establishment.repository';

import { EstablishmentProductCreateController } from './controllers/establishment-product-create.controller';
import { EstablishmentProductRepository } from './repositories/establishment-product.repository';
import { EstablishmentProductCreateService } from './services/establishment-product-create.service';

@Module({
  providers: [
    EstablishmentRepository,
    EstablishmentProductRepository,
    EstablishmentProductCreateService,
  ],
  controllers: [EstablishmentProductCreateController],
  exports: [EstablishmentProductRepository],
})
export class EstablishmentProductsModule {}
