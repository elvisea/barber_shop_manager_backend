import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Checks if the user's role (from request.member) matches the required roles.
 * This guard MUST run AFTER EstablishmentMemberGuard.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { member } = context.switchToHttp().getRequest();

    if (!member || !member.role) {
      // This indicates a configuration error, EstablishmentMemberGuard should have run first.
      throw new ForbiddenException('Resource access denied.');
    }

    const hasRole = requiredRoles.some((role) => member.role === role);

    if (hasRole) {
      return true;
    }

    throw new ForbiddenException('You do not have the required permissions.');
  }
}
