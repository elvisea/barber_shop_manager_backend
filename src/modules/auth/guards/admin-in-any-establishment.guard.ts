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

@Injectable()
export class AdminInAnyEstablishmentGuard implements CanActivate {
  private readonly logger = new Logger(AdminInAnyEstablishmentGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || [Role.ADMIN];

    const req = context.switchToHttp().getRequest();
    const user = req.user as AuthenticatedUser;

    // Verifica se o usuário tem pelo menos um vínculo ativo com a role exigida
    const hasRequiredRole = user.memberships.some(
      (m) => m.isActive && requiredRoles.includes(m.role as Role),
    );

    if (!hasRequiredRole) {
      this.logger.warn(
        `User ${user.email} does not have the required role(s) [${requiredRoles.join(', ')}] in any establishment.`,
      );

      const message = this.errorMessageService.getMessage(
        ErrorCode.USER_ROLE_NOT_PERMITTED_ANY_ESTABLISHMENT,
        { EMAIL: user.email, ROLES: requiredRoles.join(', ') },
      );

      throw new CustomHttpException(
        message,
        403,
        ErrorCode.USER_ROLE_NOT_PERMITTED_ANY_ESTABLISHMENT,
      );
    }

    this.logger.log(
      `User ${user.email} authorized with role(s) [${requiredRoles.join(', ')}] in at least one establishment.`,
    );

    return true;
  }
}
