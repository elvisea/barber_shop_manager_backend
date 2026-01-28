import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Client info extracted from the HTTP request (ip and user-agent).
 */
export interface RequestClientInfo {
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Param decorator that extracts client info (ipAddress, userAgent) from the request.
 */
export const GetRequestClientInfo = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestClientInfo => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const ipAddress = request.ip ?? request.socket?.remoteAddress;
    const userAgent = request.headers['user-agent'];

    return { ipAddress, userAgent };
  },
);
