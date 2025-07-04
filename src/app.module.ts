import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { EmailModule } from './email/email.module';
import { ErrorMessageModule } from './error-message/error-message.module';
import { AuthModule } from './modules/auth/auth.module';
import { EstablishmentModule } from './modules/establishment/establishment.module';
import { EstablishmentMembersModule } from './modules/establishment-members/establishment-members.module';
import { EstablishmentProductsModule } from './modules/establishment-products/establishment-products.module';
import { EstablishmentServicesModule } from './modules/establishment-services/establishment-services.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    ErrorMessageModule,
    EmailModule,
    AuthModule,
    EstablishmentModule,
    EstablishmentServicesModule,
    EstablishmentMembersModule,
    EstablishmentProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
