import { Module } from '@nestjs/common';

import { EstablishmentProductsModule } from '../establishment-products/establishment-products.module';
import { MembersModule } from '../members/members.module';

import { MemberProductCreateController } from './controllers/member-product-create.controller';
import { MemberProductRepository } from './repositories/member-product.repository';
import { MemberProductCreateService } from './services/member-product-create.service';

import { EstablishmentOwnerAccessModule } from '@/shared/establishment-owner-access/establishment-owner-access.module';

@Module({
  imports: [
    EstablishmentProductsModule,
    MembersModule,
    EstablishmentOwnerAccessModule,
  ],
  controllers: [MemberProductCreateController],
  providers: [MemberProductCreateService, MemberProductRepository],
  exports: [MemberProductRepository],
})
export class MemberProductsModule {}
