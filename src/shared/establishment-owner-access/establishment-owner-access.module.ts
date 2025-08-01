import { Module } from '@nestjs/common';

import { EstablishmentOwnerAccessService } from './establishment-owner-access.service';

import { ErrorMessageModule } from '@/error-message/error-message.module';
import { EstablishmentModule } from '@/modules/establishment/establishment.module';

@Module({
  imports: [ErrorMessageModule, EstablishmentModule],
  providers: [EstablishmentOwnerAccessService],
  exports: [EstablishmentOwnerAccessService],
})
export class EstablishmentOwnerAccessModule {}
