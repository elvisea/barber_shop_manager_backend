import { Member, Role } from '@prisma/client';

export interface IMemberRepository {
  createMember(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
    establishmentId: string;
  }): Promise<Member>;

  findById(id: string): Promise<Member | null>;

  findByEstablishmentAndId(
    establishmentId: string,
    memberId: string,
  ): Promise<Member | null>;

  findAllByEstablishmentPaginated({
    establishmentId,
    skip,
    take,
  }: {
    establishmentId: string;
    skip: number;
    take: number;
  }): Promise<{
    data: Member[];
    total: number;
  }>;

  updateMember(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      role: Role;
      isActive: boolean;
    }>,
  ): Promise<Member>;

  deleteMember(id: string): Promise<void>;

  existsByEmailAndEstablishment(
    email: string,
    establishmentId: string,
  ): Promise<boolean>;

  existsByPhoneAndEstablishment(
    phone: string,
    establishmentId: string,
  ): Promise<boolean>;

  existsByEmailAndEstablishmentExcludingId(
    email: string,
    establishmentId: string,
    excludeId: string,
  ): Promise<boolean>;

  existsByPhoneAndEstablishmentExcludingId(
    phone: string,
    establishmentId: string,
    excludeId: string,
  ): Promise<boolean>;
}
