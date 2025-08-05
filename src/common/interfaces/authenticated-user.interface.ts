import { MemberRole, UserRole } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  role: UserRole | MemberRole;
}
