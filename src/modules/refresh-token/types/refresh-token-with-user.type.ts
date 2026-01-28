import { RefreshToken, User } from '@prisma/client';

/**
 * Refresh token record with user data (id, role) for building JWT payload
 * without an extra query. Used by findByToken with include.
 */
export type RefreshTokenWithUser = RefreshToken & {
  user: Pick<User, 'id' | 'role'>;
};
