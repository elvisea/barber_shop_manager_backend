import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

import { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(payload: JwtPayload) {
    const environment = this.configService.get<string>(
      'NODE_ENV',
      'development',
    );

    const accessTokenExpiration = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION',
      '60s',
    );

    const refreshTokenExpiration = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
      '7d',
    );

    const accessTokenOptions: jwt.SignOptions = {
      expiresIn: (environment === 'development'
        ? '60s'
        : accessTokenExpiration) as jwt.SignOptions['expiresIn'],
    };

    const refreshTokenOptions: jwt.SignOptions = {
      expiresIn: (environment === 'development'
        ? '5m'
        : refreshTokenExpiration) as jwt.SignOptions['expiresIn'],
    };

    const accessToken = await this.jwtService.signAsync(
      payload,
      accessTokenOptions,
    );

    const refreshToken = await this.jwtService.signAsync(
      payload,
      refreshTokenOptions,
    );

    return { accessToken, refreshToken };
  }
}
