import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

import { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';

/**
 * Serviço responsável por gerar tokens JWT (acesso e refresh).
 * Utiliza ConfigService para obter tempos de expiração e JwtService para assinar os tokens.
 * Resolve a necessidade de centralizar a geração de tokens de autenticação da aplicação.
 */
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Gera o par de tokens (access e refresh) a partir do payload JWT.
   *
   * @param payload - Dados do usuário a serem incluídos no token (ex.: sub, email)
   * @returns Promessa que resolve com objeto contendo accessToken e refreshToken (strings JWT)
   */
  async generateTokens(payload: JwtPayload): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessTokenExpiration = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION',
      '60s',
    );

    const refreshTokenExpiration = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
      '7d',
    );

    const accessTokenOptions: jwt.SignOptions = {
      expiresIn: accessTokenExpiration as jwt.SignOptions['expiresIn'],
    };

    const refreshTokenOptions: jwt.SignOptions = {
      expiresIn: refreshTokenExpiration as jwt.SignOptions['expiresIn'],
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
