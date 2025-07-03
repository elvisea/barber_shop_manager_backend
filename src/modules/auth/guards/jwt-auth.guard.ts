import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: Error | null, user: any, info: Error | undefined, context: ExecutionContext) {
    if (info && info.name === 'TokenExpiredError') {
      const req = context.switchToHttp().getRequest();
      this.logger.warn(
        `Token expirado para IP: ${req.ip} | Rota: ${req.originalUrl} | User-Agent: ${req.headers['user-agent']}`,
      );
    }
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message);
    }
    return user;
  }
}