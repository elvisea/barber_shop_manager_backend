import { Module } from '@nestjs/common';

import { EstablishmentRepository } from '../establishment/repositories/establishment.repository';

import { EstablishmentCustomerCreateController } from './controllers/establishment-customer-create.controller';
import { EstablishmentCustomerDeleteController } from './controllers/establishment-customer-delete.controller';
import { EstablishmentCustomerFindAllController } from './controllers/establishment-customer-find-all.controller';
import { EstablishmentCustomerFindByIdController } from './controllers/establishment-customer-find-by-id.controller';
import { EstablishmentCustomerRepository } from './repositories/establishment-customer.repository';
import { EstablishmentCustomerCreateService } from './services/establishment-customer-create.service';
import { EstablishmentCustomerDeleteService } from './services/establishment-customer-delete.service';
import { EstablishmentCustomerFindAllService } from './services/establishment-customer-find-all.service';
import { EstablishmentCustomerFindByIdService } from './services/establishment-customer-find-by-id.service';

import { ErrorMessageService } from '@/error-message/error-message.service';

@Module({
  imports: [],
  controllers: [
    EstablishmentCustomerCreateController,
    EstablishmentCustomerFindByIdController,
    EstablishmentCustomerFindAllController,
    EstablishmentCustomerDeleteController,
  ],
  providers: [
    EstablishmentCustomerCreateService,
    EstablishmentCustomerFindByIdService,
    EstablishmentCustomerFindAllService,
    EstablishmentCustomerDeleteService,
    EstablishmentCustomerRepository,
    EstablishmentRepository,
    ErrorMessageService,
  ],
  exports: [EstablishmentCustomerRepository],
})
export class EstablishmentCustomerModule { }
