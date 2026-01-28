import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TokenService } from './token.service';

@Module({
  imports: [
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

  providers: [TokenService],
  exports: [TokenService, JwtModule],
})
export class TokenModule {}
