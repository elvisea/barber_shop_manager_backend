import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

/**
 * Checks if the user's role (from JWT memberships) matches the required roles for the establishment.
 */
@Injectable()
export class EstablishmentMemberGuard implements CanActivate {
  private readonly logger = new Logger(EstablishmentMemberGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      this.logger.log('No roles required for this route. Access granted.');
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
      this.logger.warn('EstablishmentId not provided in the request.');
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: user.id },
      );
      throw new CustomHttpException(
        message,
        400,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    // 2. Buscar membership do usuário para o estabelecimento
    const membership = user.memberships.find(
      (m) => m.establishmentId === establishmentId,
    );
    if (!membership) {
      this.logger.warn(
        `User ${user.email} is not a member of establishment ${establishmentId}.`,
      );
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: user.id },
      );
      throw new CustomHttpException(
        message,
        403,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    // 3. Verificar se está ativo
    if (!membership.isActive) {
      this.logger.warn(
        `User ${user.email} is not active in establishment ${establishmentId}.`,
      );
      const message = this.errorMessageService.getMessage(
        ErrorCode.USER_NOT_ACTIVE_IN_ANY_ESTABLISHMENT,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: user.id },
      );
      throw new CustomHttpException(
        message,
        403,
        ErrorCode.USER_NOT_ACTIVE_IN_ANY_ESTABLISHMENT,
      );
    }

    // 4. Verificar se a role é permitida
    if (!requiredRoles.includes(membership.role as Role)) {
      this.logger.warn(
        `User ${user.email} does not have required role for establishment ${establishmentId}. Required: [${requiredRoles.join(', ')}], User: ${membership.role}`,
      );
      const message = this.errorMessageService.getMessage(
        ErrorCode.INSUFFICIENT_ROLE,
        {
          ESTABLISHMENT_ID: establishmentId,
          USER_ID: user.id,
          ROLE: membership.role,
        },
      );
      throw new CustomHttpException(message, 403, ErrorCode.INSUFFICIENT_ROLE);
    }

    this.logger.log(
      `User ${user.email} authorized for establishment ${establishmentId} with role ${membership.role}.`,
    );
    return true;
  }
}
