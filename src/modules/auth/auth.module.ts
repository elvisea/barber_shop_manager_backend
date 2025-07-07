import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EstablishmentMembersModule } from '../establishment-members/establishment-members.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { ErrorMessageModule } from '@/error-message/error-message.module';

@Module({
  imports: [
    PassportModule,
    UserModule,
    RefreshTokenModule,
    ErrorMessageModule,
    EstablishmentMembersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        const publicKey = config.get<string>('JWT_SECRET_PUBLIC_KEY');
        const privateKey = config.get<string>('JWT_SECRET_PRIVATE_KEY');

        if (!publicKey || !privateKey) {
          throw new Error('JWT keys not found in environment variables');
        }

        return {
          signOptions: { algorithm: 'RS256' },
          publicKey: Buffer.from(publicKey, 'base64'),
          privateKey: Buffer.from(privateKey, 'base64'),
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, TokenService, AuthService],
})
export class AuthModule {}
