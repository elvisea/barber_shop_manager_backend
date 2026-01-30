import { Establishment } from '@prisma/client';

import { EstablishmentCreateRequestDTO } from '../dtos/establishment-create-request.dto';
import { EstablishmentWithUserAccess } from '../types/establishment-with-user-access.type';

export interface IEstablishmentRepository {
  create(
    data: EstablishmentCreateRequestDTO,
    userId: string,
  ): Promise<Establishment>;

  findById(establishmentId: string): Promise<Establishment | null>;

  /**
   * Busca estabelecimento por ID com vínculo do usuário (se houver) em uma única query.
   * Usado para validar acesso: owner (ownerId) ou member (userEstablishments ativo com role).
   */
  findByIdWithUserAccess(
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentWithUserAccess | null>;

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

  deleteByIdAndUser(establishmentId: string, userId: string): Promise<void>;

  findByIdWithMembersAdmin(establishmentId: string): Promise<
    | (Establishment & {
        userEstablishments: Array<{ id: string; role: string }>;
      })
    | null
  >;
}
