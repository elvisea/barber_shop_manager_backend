import { Establishment, UserRole } from '@prisma/client';

/**
 * User-establishment link data returned in a single query with establishment.
 */
export interface EstablishmentAccessUserEstablishment {
  id: string;
  isActive: boolean;
  role: UserRole;
}

/**
 * Return type of the centralized establishment-access check.
 * isOwner and userEstablishment.role are used by downstream permission logic (e.g. appointments).
 */
export interface EstablishmentAccessResult {
  establishment: Establishment;
  isOwner: boolean;
  userEstablishment?: EstablishmentAccessUserEstablishment;
}
