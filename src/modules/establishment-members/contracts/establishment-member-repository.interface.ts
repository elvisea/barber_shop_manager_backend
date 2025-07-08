import { Establishment, EstablishmentMember, Role } from '@prisma/client';

export interface IEstablishmentMemberRepository {
  findEstablishmentByIdAndAdmin(
    establishmentId: string,
    userId: string,
  ): Promise<(EstablishmentMember & { establishment: Establishment }) | null>;

  createMember(data: {
    userId: string;
    establishmentId: string;
    role: Role;
  }): Promise<EstablishmentMember>;

  existsByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<boolean>;

  deleteByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<void>;
}
