import { EstablishmentCustomer } from '@prisma/client';

import { EstablishmentCustomerCreateRequestDTO } from '../dtos/establishment-customer-create-request.dto';
import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';

export interface IEstablishmentCustomerRepository {
  existsByEmail(establishmentId: string, email: string): Promise<boolean>;
  existsByPhone(establishmentId: string, phone: string): Promise<boolean>;
  createCustomer(
    dto: Omit<EstablishmentCustomerCreateRequestDTO, 'establishmentId'>,
    establishmentId: string,
  ): Promise<EstablishmentCustomerCreateResponseDTO>;
  findByIdAndEstablishment(
    customerId: string,
    establishmentId: string,
  ): Promise<EstablishmentCustomer | null>;
}
