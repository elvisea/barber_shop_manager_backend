import { Module } from '@nestjs/common';

import { MemberProductCreateController } from './controllers/member-product-create.controller';
import { MemberProductRepository } from './repositories/member-product.repository';
import { MemberProductCreateService } from './services/member-product-create.service';

import { EstablishmentModule } from '@/modules/establishment/establishment.module';
import { EstablishmentProductsModule } from '@/modules/establishment-products/establishment-products.module';
import { MembersModule } from '@/modules/members/members.module';

@Module({
  imports: [EstablishmentModule, EstablishmentProductsModule, MembersModule],
  controllers: [MemberProductCreateController],
  providers: [MemberProductCreateService, MemberProductRepository],
})
export class MemberProductsModule {}
