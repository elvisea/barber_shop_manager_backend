import { Establishment, EstablishmentMember } from '@prisma/client';

export interface IEstablishmentMemberRepository {
  findEstablishmentByIdAndAdmin(
    establishmentId: string,
    userId: string,
  ): Promise<(EstablishmentMember & { establishment: Establishment }) | null>;
}
