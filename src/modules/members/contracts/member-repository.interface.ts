import {
  Member,
  MemberEmailVerification,
  MemberRole,
  Prisma,
} from '@prisma/client';

type MemberWithEstablishment = Prisma.MemberGetPayload<{
  include: { establishment: true };
}>;

export interface IMemberRepository {
  createMember(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: MemberRole;
    establishmentId: string;
  }): Promise<Member>;

  findById(id: string): Promise<Member | null>;

  findByIdWithEstablishment(
    id: string,
  ): Promise<MemberWithEstablishment | null>;

  findByEmail(email: string): Promise<Member | null>;

  findByEmailWithVerification(
    email: string,
  ): Promise<
    (Member & { emailVerification: MemberEmailVerification | null }) | null
  >;

  findByEstablishmentAndId(
    establishmentId: string,
    memberId: string,
  ): Promise<Member | null>;

  findByEmailAndEstablishment(
    email: string,
    establishmentId: string,
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
      role: MemberRole;
      isActive: boolean;
    }>,
  ): Promise<Member>;

  deleteMember(id: string): Promise<void>;

  existsByEmail(email: string): Promise<boolean>;

  existsByPhone(phone: string): Promise<boolean>;

  existsByEmailExcludingId(email: string, excludeId: string): Promise<boolean>;

  existsByPhoneExcludingId(phone: string, excludeId: string): Promise<boolean>;

  // Métodos legados mantidos para compatibilidade
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
