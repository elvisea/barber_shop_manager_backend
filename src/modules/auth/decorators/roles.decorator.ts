import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

/**
 * The key for the roles metadata.
 */
export const ROLES_KEY = 'roles';

/**
 * The decorator for the roles.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
