import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest<TUser = AuthenticatedUser>(
    err: Error | null,
    user: TUser,
    info: Error | undefined,
    context: ExecutionContext,
  ): TUser {
    const req = context.switchToHttp().getRequest();
    const logContext = {
      ip: req.ip,
      route: req.originalUrl,
      userAgent: req.headers['user-agent'],
      method: req.method,
      timestamp: new Date().toISOString(),
    };

    if (info && info.name === 'TokenExpiredError') {
      this.logger.warn(
        JSON.stringify(
          {
            ...logContext,
            event: 'token_expired',
            message: 'JWT token expired',
          },
          null,
          2,
        ),
      );
    }

    if (err || !user) {
      this.logger.warn(
        JSON.stringify(
          {
            ...logContext,
            event: 'unauthorized',
            error: err?.message || info?.message || 'User not authenticated',
          },
          null,
          2,
        ),
      );
      throw err || new UnauthorizedException(info?.message);
    }

    // Tipagem explícita para AuthenticatedUser
    const authUser = user as unknown as AuthenticatedUser;

    this.logger.log(
      JSON.stringify(
        {
          ...logContext,
          event: 'jwt_authenticated',
          userId: authUser.id,
          email: authUser.email,
        },
        null,
        2,
      ),
    );

    return user;
  }
}
