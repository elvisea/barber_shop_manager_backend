import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async generateTokens(id: string) {
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

    const payload: JwtPayload = { sub: id };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: environment === 'development' ? '15m' : accessTokenExpiration,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: environment === 'development' ? '30d' : refreshTokenExpiration,
    });

    return { accessToken, refreshToken };
  }
} 