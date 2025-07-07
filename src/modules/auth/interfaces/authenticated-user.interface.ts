export interface AuthenticatedUser {
  id: string;
  email: string;
  memberships: Array<{
    establishmentId: string;
    role: string;
    isActive: boolean;
  }>;
}
