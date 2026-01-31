import { Module } from '@nestjs/common';

import { EstablishmentAccessService } from './services/establishment-access.service';

import { EstablishmentModule } from '@/modules/establishment/establishment.module';

/** Exports the centralized establishment-access service for the Me and Appointments modules. */
@Module({
  imports: [EstablishmentModule],
  providers: [EstablishmentAccessService],
  exports: [EstablishmentAccessService],
})
export class EstablishmentAccessModule {}
