import { UserEmailVerification } from '@prisma/client';

export interface IUserEmailVerificationRepository {
  createUserEmailVerification(data: {
    token: string;
    expiresAt: Date;
    userId: string;
  }): Promise<UserEmailVerification>;

  findByToken(token: string): Promise<UserEmailVerification | null>;

  findByUserId(userId: string): Promise<UserEmailVerification | null>;

  updateVerification(
    id: string,
    data: { verified: boolean },
  ): Promise<UserEmailVerification>;

  deleteVerification(id: string): Promise<void>;

  deleteExpiredVerifications(): Promise<number>;
}
