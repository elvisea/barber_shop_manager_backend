import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';

import { EmailModule } from './email/email.module';
import { ErrorMessageModule } from './error-message/error-message.module';

@Module({
  imports: [
    // Configuração global do ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configurações globais
    PrismaModule,
    EmailModule,
    ErrorMessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
