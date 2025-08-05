import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

/**
 * The decorator for the request role.
 */
export const GetRequestRole = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser['role'] => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;
    return user.role;
  },
);
