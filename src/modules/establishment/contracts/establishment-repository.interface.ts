import { Establishment } from '@prisma/client';

import { EstablishmentCreateRequestDTO } from '../dtos/establishment-create-request.dto';

export interface IEstablishmentRepository {
  create(
    data: EstablishmentCreateRequestDTO,
    userId: string,
  ): Promise<Establishment>;

  findByPhoneAndUser(
    phone: string,
    userId: string,
  ): Promise<Establishment | null>;
}
