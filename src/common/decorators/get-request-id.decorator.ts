import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

/**
 * The decorator for the request ID.
 */
export const GetRequestId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const { user } = ctx.switchToHttp().getRequest<{
      user: AuthenticatedUser;
    }>();
    return user.id;
  },
);
