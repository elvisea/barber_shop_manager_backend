import { Prisma, Token, User, UserRole } from '@prisma/client';

import { MemberRelationshipsSummaryDTO } from '../dtos/member-summary-response.dto';

type MemberWithEstablishment = Prisma.UserGetPayload<{
  include: { ownedEstablishments: true };
}>;

export interface IMemberRepository {
  createMember(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    establishmentId: string;
  }): Promise<User>;

  findById(id: string): Promise<User | null>;

  findByIdWithEstablishment(
    id: string,
  ): Promise<MemberWithEstablishment | null>;

  findByEmail(email: string): Promise<User | null>;

  findByEmailWithVerification(
    email: string,
  ): Promise<(User & { verificationToken: Token | null }) | null>;

  findByEstablishmentAndId(
    establishmentId: string,
    memberId: string,
  ): Promise<User | null>;

  findByEstablishmentAndIdWithEstablishment(
    establishmentId: string,
    memberId: string,
  ): Promise<MemberWithEstablishment | null>;

  findByEmailAndEstablishment(
    email: string,
    establishmentId: string,
  ): Promise<User | null>;

  findAllByEstablishmentPaginated({
    establishmentId,
    skip,
    take,
  }: {
    establishmentId: string;
    skip: number;
    take: number;
  }): Promise<{
    data: User[];
    total: number;
  }>;

  updateMember(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      role: UserRole;
      isActive: boolean;
    }>,
  ): Promise<User>;

  deleteMember(id: string, deletedByUserId: string): Promise<void>;

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

  getMemberSummary(
    memberId: string,
    establishmentId: string,
  ): Promise<MemberRelationshipsSummaryDTO>;
}
