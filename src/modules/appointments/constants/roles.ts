import { UserRole } from '@prisma/client';

/**
 * Roles allowed to access appointment endpoints.
 * All roles except ROOT (establishment-level roles only).
 */
export const APPOINTMENT_ALLOWED_ROLES: UserRole[] = [
  UserRole.OWNER,
  UserRole.RECEPTIONIST,
  UserRole.HAIRDRESSER,
  UserRole.BARBER,
];
