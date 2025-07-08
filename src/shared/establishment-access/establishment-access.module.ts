import { Global, Module } from '@nestjs/common';

import { EstablishmentAccessService } from './establishment-access.service';

import { EstablishmentModule } from '@/modules/establishment/establishment.module';

@Global()
@Module({
  imports: [EstablishmentModule],
  providers: [EstablishmentAccessService],
  exports: [EstablishmentAccessService],
})
export class EstablishmentAccessModule {}
