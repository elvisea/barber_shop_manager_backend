import { User, UserEmailVerification } from '@prisma/client';

export interface IUserEmailVerificationRepository {
  createUserEmailVerification(data: {
    token: string;
    email: string;
    expiresAt: Date;
    userId: string;
  }): Promise<UserEmailVerification>;

  findByEmail(email: string): Promise<UserEmailVerification | null>;

  findByEmailWithUser(
    email: string,
  ): Promise<(UserEmailVerification & { user: User }) | null>;

  findByUserId(userId: string): Promise<UserEmailVerification | null>;

  findAllNonExpired(): Promise<UserEmailVerification[]>;

  updateVerification(
    id: string,
    data: { verified: boolean },
  ): Promise<UserEmailVerification>;

  updateTokenAndExpiration(
    id: string,
    data: { token: string; expiresAt: Date },
  ): Promise<UserEmailVerification>;

  deleteVerification(id: string): Promise<void>;

  deleteExpiredVerifications(): Promise<number>;
}
