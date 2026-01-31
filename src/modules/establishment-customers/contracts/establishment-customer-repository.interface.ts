import { EstablishmentCustomer, Prisma } from '@prisma/client';

import { EstablishmentCustomerCreateRequestDTO } from '../dtos/establishment-customer-create-request.dto';
import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';

type EstablishmentCustomerWithEstablishment =
  Prisma.EstablishmentCustomerGetPayload<{
    include: { establishment: true };
  }>;

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
  findByIdWithEstablishment(
    customerId: string,
  ): Promise<EstablishmentCustomerWithEstablishment | null>;
  findByEmailAndEstablishment(
    establishmentId: string,
    email: string,
  ): Promise<EstablishmentCustomer | null>;
  findByPhoneAndEstablishment(
    establishmentId: string,
    phone: string,
  ): Promise<EstablishmentCustomer | null>;
  findAllByEstablishmentPaginated(params: {
    establishmentId: string;
    skip: number;
    take: number;
  }): Promise<{ data: EstablishmentCustomer[]; total: number }>;
  updateByIdAndEstablishment(
    customerId: string,
    establishmentId: string,
    dto: Partial<{
      name: string;
      email?: string | null;
      phone?: string | null;
    }>,
  ): Promise<EstablishmentCustomer>;
  deleteById(customerId: string, deletedByUserId: string): Promise<void>;
  deleteByIdAndEstablishment(
    customerId: string,
    establishmentId: string,
    deletedByUserId: string,
  ): Promise<void>;
}
