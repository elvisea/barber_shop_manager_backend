export interface JwtPayload {
  sub: string; // userId
  email: string;
  memberships: Array<{
    establishmentId: string;
    role: string;
    isActive: boolean;
  }>;
}
