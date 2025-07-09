import { Module } from '@nestjs/common';

import { EstablishmentMembersModule } from '../establishment-members/establishment-members.module';
import { EstablishmentProductsModule } from '../establishment-products/establishment-products.module';

import { MemberProductCreateController } from './controllers/member-product-create.controller';
import { MemberProductRepository } from './repositories/member-product.repository';
import { MemberProductCreateService } from './services/member-product-create.service';

@Module({
  imports: [EstablishmentProductsModule, EstablishmentMembersModule],
  controllers: [MemberProductCreateController],
  providers: [MemberProductCreateService, MemberProductRepository],
  exports: [MemberProductRepository],
})
export class MemberProductsModule {}
