import { Establishment } from '@prisma/client';

import { CreateEstablishmentRequestDTO } from '../dtos/create-establishment-request.dto';

export interface IEstablishmentRepository {
  create(
    data: CreateEstablishmentRequestDTO,
    userId: string,
  ): Promise<Establishment>;

  findByPhoneAndUser(
    phone: string,
    userId: string,
  ): Promise<Establishment | null>;
}
