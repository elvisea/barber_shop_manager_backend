import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { EmailModule } from './email/email.module';
import { ErrorMessageModule } from './error-message/error-message.module';
import { HttpClientModule } from './http-client/http-client.module';
import { AIModule } from './modules/ai/ai.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailsModule } from './modules/emails/emails.module';
import { EstablishmentModule } from './modules/establishment/establishment.module';
import { EstablishmentCustomerModule } from './modules/establishment-customers/establishment-customer.module';
import { EstablishmentProductsModule } from './modules/establishment-products/establishment-products.module';
import { EstablishmentServicesModule } from './modules/establishment-services/establishment-services.module';
import { MemberAuthModule } from './modules/member-auth/member-auth.module';
import { MemberEmailVerificationModule } from './modules/member-email-verification/member-email-verification.module';
import { MemberProductsModule } from './modules/member-products/member-products.module';
import { MemberServicesModule } from './modules/member-services/member-services.module';
import { MembersModule } from './modules/members/members.module';
import { PlansModule } from './modules/plans/plans.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { UserModule } from './modules/user/user.module';
import { UserEmailVerificationModule } from './modules/user-email-verification/user-email-verification.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { PrismaModule } from './prisma/prisma.module';
import { TokenModule } from './shared/token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    HttpClientModule,
    PrismaModule,
    ErrorMessageModule,
    EmailModule,
    EmailsModule,
    TokenModule,
    AuthModule,
    UserModule,
    EstablishmentModule,
    EstablishmentCustomerModule,
    EstablishmentProductsModule,
    EstablishmentServicesModule,
    MembersModule,
    MemberAuthModule,
    MemberProductsModule,
    MemberServicesModule,
    PlansModule,
    SubscriptionsModule,
    RefreshTokenModule,
    WebhookModule,
    AIModule,
    UserEmailVerificationModule,
    MemberEmailVerificationModule,
    AppointmentsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
