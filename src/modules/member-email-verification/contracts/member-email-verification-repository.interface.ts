import { Member, MemberEmailVerification } from '@prisma/client';

export interface IMemberEmailVerificationRepository {
  createMemberEmailVerification(data: {
    token: string;
    email: string;
    expiresAt: Date;
    memberId: string;
  }): Promise<MemberEmailVerification>;

  findByEmail(email: string): Promise<MemberEmailVerification | null>;

  findByEmailWithMember(
    email: string,
  ): Promise<(MemberEmailVerification & { member: Member }) | null>;

  findByMemberId(memberId: string): Promise<MemberEmailVerification | null>;

  findAllNonExpired(): Promise<MemberEmailVerification[]>;

  updateVerification(
    id: string,
    data: { verified: boolean },
  ): Promise<MemberEmailVerification>;

  updateTokenAndExpiration(
    id: string,
    data: { token: string; expiresAt: Date },
  ): Promise<MemberEmailVerification>;

  deleteVerification(id: string): Promise<void>;

  deleteExpiredVerifications(): Promise<number>;
}
