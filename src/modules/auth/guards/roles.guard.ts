import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

/**
 * Checks if the user's role (from JWT memberships) matches the required roles for the establishment.
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

    const req = context.switchToHttp().getRequest();
    const user = req.user as AuthenticatedUser;

    // 1. Obter establishmentId da rota
    const establishmentId =
      req.params?.establishmentId ||
      req.body?.establishmentId ||
      req.query?.establishmentId;
    if (!establishmentId) {
      throw new BadRequestException(
        'EstablishmentId must be provided in the request.',
      );
    }

    // 2. Buscar membership do usuário para o estabelecimento
    const membership = user.memberships.find(
      (m) => m.establishmentId === establishmentId,
    );
    if (!membership) {
      throw new ForbiddenException(
        'User is not a member of this establishment.',
      );
    }

    // 3. Verificar se está ativo
    if (!membership.isActive) {
      throw new ForbiddenException('User is not active in this establishment.');
    }

    // 4. Verificar se a role é permitida
    if (!requiredRoles.includes(membership.role as Role)) {
      throw new ForbiddenException(
        'User does not have the required role for this resource.',
      );
    }

    return true;
  }
}
