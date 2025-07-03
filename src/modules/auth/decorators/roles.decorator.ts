import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

/**
 * The key for the roles metadata.
 */
export const ROLES_KEY = 'roles';

/**
 * The decorator for the roles.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles); 