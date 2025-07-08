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

  findByIdAndUser(
    establishmentId: string,
    userId: string,
  ): Promise<Establishment | null>;

  findAllByUserPaginated(params: {
    userId: string;
    skip: number;
    take: number;
  }): Promise<{ data: Establishment[]; total: number }>;

  update(
    establishmentId: string,
    dto: Partial<{ name: string; address: string; phone: string }>,
  ): Promise<Establishment>;

  deleteByIdAndUser(establishmentId: string): Promise<void>;

  findByIdWithMembersAdmin(
    establishmentId: string,
  ): Promise<
    | (Establishment & { members: Array<{ userId: string; role: string }> })
    | null
  >;
}
