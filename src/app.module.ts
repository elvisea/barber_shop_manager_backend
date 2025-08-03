import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { EmailModule } from './email/email.module';
import { ErrorMessageModule } from './error-message/error-message.module';
import { HttpClientModule } from './http-client/http-client.module';
import { AIModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { EstablishmentModule } from './modules/establishment/establishment.module';
import { EstablishmentCustomerModule } from './modules/establishment-customers/establishment-customer.module';
import { EstablishmentMembersModule } from './modules/establishment-members/establishment-members.module';
import { EstablishmentProductsModule } from './modules/establishment-products/establishment-products.module';
import { EstablishmentServicesModule } from './modules/establishment-services/establishment-services.module';
import { MemberAuthModule } from './modules/member-auth/member-auth.module';
import { MemberProductsModule } from './modules/member-products/member-products.module';
import { MemberServicesModule } from './modules/member-services/member-services.module';
import { MembersModule } from './modules/members/members.module';
import { PlansModule } from './modules/plans/plans.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { UserModule } from './modules/user/user.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { PrismaModule } from './prisma/prisma.module';
import { EstablishmentAccessModule } from './shared/establishment-access/establishment-access.module';
import { EstablishmentOwnerAccessModule } from './shared/establishment-owner-access/establishment-owner-access.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpClientModule,
    PrismaModule,
    UserModule,
    ErrorMessageModule,
    EmailModule,
    AuthModule,
    MemberAuthModule,
    EstablishmentAccessModule,
    EstablishmentOwnerAccessModule,
    EstablishmentModule,
    EstablishmentServicesModule,
    EstablishmentMembersModule,
    EstablishmentProductsModule,
    EstablishmentCustomerModule,
    MemberProductsModule,
    MemberServicesModule,
    MembersModule,
    WebhookModule,
    AIModule,
    PlansModule,
    SubscriptionsModule,
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
