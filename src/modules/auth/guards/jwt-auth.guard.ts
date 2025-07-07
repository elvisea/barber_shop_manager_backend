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
    if (info && info.name === 'TokenExpiredError') {
      const req = context.switchToHttp().getRequest();
      this.logger.warn(
        `Expired token for IP: ${req.ip} | Route: ${req.originalUrl} | User-Agent: ${req.headers['user-agent']}`,
      );
    }
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message);
    }
    return user;
  }
}
