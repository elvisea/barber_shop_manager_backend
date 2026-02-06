import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

/**
 * The decorator for the request role.
 */
export const GetRequestRole = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser['role'] => {
    const { user } = ctx.switchToHttp().getRequest<{
      user: AuthenticatedUser;
    }>();
    return user.role;
  },
);
