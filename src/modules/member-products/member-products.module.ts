import { Module } from '@nestjs/common';

import { MemberProductCreateController } from './controllers/member-product-create.controller';
import { MemberProductDeleteController } from './controllers/member-product-delete.controller';
import { MemberProductFindAllController } from './controllers/member-product-find-all.controller';
import { MemberProductFindOneController } from './controllers/member-product-find-one.controller';
import { MemberProductUpdateController } from './controllers/member-product-update.controller';
import { MemberProductRepository } from './repositories/member-product.repository';
import { MemberProductCreateService } from './services/member-product-create.service';
import { MemberProductDeleteService } from './services/member-product-delete.service';
import { MemberProductFindAllService } from './services/member-product-find-all.service';
import { MemberProductFindOneService } from './services/member-product-find-one.service';
import { MemberProductUpdateService } from './services/member-product-update.service';
import { MemberProductValidationService } from './services/member-product-validation.service';

import { EstablishmentModule } from '@/modules/establishment/establishment.module';
import { EstablishmentProductsModule } from '@/modules/establishment-products/establishment-products.module';
import { UserEstablishmentsModule } from '@/modules/user-establishments/user-establishments.module';

@Module({
  imports: [
    EstablishmentModule,
    EstablishmentProductsModule,
    UserEstablishmentsModule,
  ],
  controllers: [
    MemberProductCreateController,
    MemberProductFindAllController,
    MemberProductFindOneController,
    MemberProductUpdateController,
    MemberProductDeleteController,
  ],
  providers: [
    MemberProductCreateService,
    MemberProductFindAllService,
    MemberProductFindOneService,
    MemberProductUpdateService,
    MemberProductDeleteService,
    MemberProductValidationService,
    MemberProductRepository,
  ],
})
export class MemberProductsModule {}
