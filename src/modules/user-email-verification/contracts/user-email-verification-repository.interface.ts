import { UserEmailVerification } from '@prisma/client';

export interface IUserEmailVerificationRepository {
  createUserEmailVerification(data: {
    token: string;
    email: string;
    expiresAt: Date;
    userId: string;
  }): Promise<UserEmailVerification>;

  findByEmail(email: string): Promise<UserEmailVerification | null>;

  findByUserId(userId: string): Promise<UserEmailVerification | null>;

  findAllNonExpired(): Promise<UserEmailVerification[]>;

  updateVerification(
    id: string,
    data: { verified: boolean },
  ): Promise<UserEmailVerification>;

  deleteVerification(id: string): Promise<void>;

  deleteExpiredVerifications(): Promise<number>;
}
