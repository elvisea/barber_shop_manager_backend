import { Module } from '@nestjs/common';

import { EstablishmentRepository } from '../establishment/repositories/establishment.repository';

import { EstablishmentCustomerCreateController } from './controllers/establishment-customer-create.controller';
import { EstablishmentCustomerRepository } from './repositories/establishment-customer.repository';
import { EstablishmentCustomerCreateService } from './services/establishment-customer-create.service';

import { ErrorMessageService } from '@/error-message/error-message.service';

@Module({
  imports: [],
  controllers: [EstablishmentCustomerCreateController],
  providers: [
    EstablishmentCustomerCreateService,
    EstablishmentCustomerRepository,
    EstablishmentRepository,
    ErrorMessageService,
  ],
  exports: [EstablishmentCustomerRepository],
})
export class EstablishmentCustomerModule {}
