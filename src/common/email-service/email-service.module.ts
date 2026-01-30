import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';

import { EmailService } from './services/email.service';
import { logEtherealAccountCreated } from './utils/ethereal-logger.util';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('EmailServiceModule');
        const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
        const isProduction = nodeEnv === 'production';

        logger.log(
          `📧 Email service configuration - NODE_ENV: ${nodeEnv}, isProduction: ${isProduction}`,
        );

        // Em produção, usar SMTP real
        if (isProduction) {
          logger.log('📧 Modo PRODUÇÃO detectado - usando SMTP real');
          const mailHost = configService.get<string>('MAIL_HOST') || '';
          const mailPort = configService.get<string>('MAIL_PORT') || '';
          const mailUser = configService.get<string>('MAIL_USER') || '';
          const mailPass = configService.get<string>('MAIL_PASS') || '';

          logger.debug('SMTP configuration check', {
            hasHost: !!mailHost,
            hasPort: !!mailPort,
            hasUser: !!mailUser,
            hasPass: !!mailPass,
            host: mailHost || 'NOT SET',
            port: mailPort || 'NOT SET',
          });

          // Validar se as variáveis SMTP estão configuradas
          if (!mailHost || !mailPort || !mailUser || !mailPass) {
            logger.error(
              'SMTP configuration missing in production environment',
              {
                hasHost: !!mailHost,
                hasPort: !!mailPort,
                hasUser: !!mailUser,
                hasPass: !!mailPass,
                nodeEnv,
              },
            );

            throw new Error(
              'SMTP configuration is required in production. Please configure MAIL_HOST, MAIL_PORT, MAIL_USER, and MAIL_PASS environment variables.',
            );
          }

          return {
            transport: {
              host: mailHost,
              port: Number(mailPort),
              secure: configService.get('MAIL_SECURE') === 'true',
              auth: {
                user: mailUser,
                pass: mailPass,
              },
            },
          };
        }

        // Em desenvolvimento, usar Ethereal Email
        const etherealUsername =
          configService.get<string>('ETHEREAL_USERNAME') || '';
        const etherealPassword =
          configService.get<string>('ETHEREAL_PASSWORD') || '';

        // Log de debug para diagnóstico
        const mailHost = configService.get<string>('MAIL_HOST') || '';
        const mailUser = configService.get<string>('MAIL_USER') || '';
        logger.log('📧 Modo DESENVOLVIMENTO detectado - usando Ethereal Email');
        logger.debug('Email transport decision', {
          nodeEnv,
          isProduction,
          hasEtherealCreds: !!(etherealUsername && etherealPassword),
          hasSmtpCreds: !!(mailHost && mailUser),
        });

        if (etherealUsername && etherealPassword) {
          logger.log('📧 Usando credenciais Ethereal configuradas no .env');
          // Usar credenciais fixas do Ethereal (recomendado para contas persistentes)
          return {
            transport: {
              host: 'smtp.ethereal.email',
              port: 587,
              secure: false,
              auth: {
                user: etherealUsername,
                pass: etherealPassword,
              },
            },
          };
        }

        // Criar conta Ethereal automaticamente (conta temporária)
        try {
          logger.log('📧 Criando conta Ethereal temporária automaticamente...');
          const testAccount = await nodemailer.createTestAccount();

          logEtherealAccountCreated(testAccount.user, testAccount.pass);

          return {
            transport: {
              host: 'smtp.ethereal.email',
              port: 587,
              secure: false,
              auth: {
                user: testAccount.user,
                pass: testAccount.pass,
              },
            },
          };
        } catch (error: unknown) {
          // Se não conseguir criar conta Ethereal, logar erro mas não quebrar inicialização
          // O erro será tratado quando tentar enviar email
          const errorDetails =
            error instanceof Error ? error.message : String(error);
          logger.error('Failed to create Ethereal account', {
            error: errorDetails,
            suggestion:
              'Configure ETHEREAL_USERNAME and ETHEREAL_PASSWORD in .env or check your internet connection',
          });

          // Em desenvolvimento, se não conseguir criar conta Ethereal, ainda assim
          // tentar usar um transport básico que falhará graciosamente
          // Isso permite que a aplicação inicie, mas emails não serão enviados
          logger.warn(
            '⚠️  Email service will not work until Ethereal account is configured',
          );

          // Retornar um transport que falhará graciosamente
          // Isso permite que a aplicação inicie mesmo sem Ethereal
          return {
            transport: {
              host: 'smtp.ethereal.email',
              port: 587,
              secure: false,
              auth: {
                user: 'not-configured',
                pass: 'not-configured',
              },
            },
          };
        }
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailServiceModule {}
