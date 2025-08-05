import { MemberRole, UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  role: UserRole | MemberRole;
}
