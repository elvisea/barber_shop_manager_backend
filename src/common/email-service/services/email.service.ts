import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';

import templates from './templates';

import { handleServiceError } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

interface ISendMail {
  from?: string;
  to: string | string[];
  subject: string;
  template: keyof typeof templates;
  variables?: Record<string, string>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly defaultFrom: string;
  private readonly isDevelopment: boolean;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly errorMessageService: ErrorMessageService,
  ) {
    this.defaultFrom =
      this.configService.get<string>('MAIL_USER_NO_REPLY') ||
      'noreply@barbershopmanager.com.br';
    this.isDevelopment =
      (this.configService.get<string>('NODE_ENV') || 'development') !==
      'production';

    this.logger.debug(
      `Email service initialized - Default From: ${this.defaultFrom} | Environment: ${this.isDevelopment ? 'development' : 'production'}`,
    );
  }

  async send({
    from = this.defaultFrom,
    to,
    subject,
    template,
    variables = {},
  }: ISendMail): Promise<boolean> {
    const recipients = Array.isArray(to) ? to.join(', ') : to;
    this.logger.log(
      `Preparing email to: ${recipients} - Subject: "${subject}"`,
    );

    try {
      const processedHtml = this.replaceTemplateVariables(
        templates[template],
        variables,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.mailerService.sendMail({
        from,
        to,
        subject,
        html: processedHtml,
        text: this.generateTextVersion(processedHtml),
      });

      // Type guard para verificar se result tem messageId de forma segura
      const resultAsRecord = result as unknown as Record<string, unknown>;
      let messageId = 'unknown';

      if (
        typeof resultAsRecord === 'object' &&
        resultAsRecord !== null &&
        'messageId' in resultAsRecord
      ) {
        const messageIdValue = resultAsRecord.messageId;
        if (typeof messageIdValue === 'string') {
          messageId = messageIdValue;
        } else if (
          typeof messageIdValue === 'number' ||
          typeof messageIdValue === 'boolean'
        ) {
          messageId = String(messageIdValue);
        }
      }

      // Em desenvolvimento, tentar obter URL de preview do Ethereal
      if (this.isDevelopment) {
        try {
          // Type assertion necessário pois mailerService.sendMail retorna any

          const previewUrl = nodemailer.getTestMessageUrl(
            result as unknown as nodemailer.SentMessageInfo,
          );
          if (previewUrl) {
            this.logEtherealPreview(recipients, subject, previewUrl);
            this.logSuccessfulSend(recipients, subject, messageId, previewUrl);
            return true;
          }
        } catch {
          // Se não conseguir obter preview URL, continua normalmente
          this.logger.debug(
            'Could not get preview URL (may not be using Ethereal)',
          );
        }
      }

      this.logSuccessfulSend(recipients, subject, messageId);
      return true;
    } catch (error: unknown) {
      const recipientEmail = Array.isArray(to) ? to[0] : to;

      handleServiceError({
        error,
        logger: this.logger,
        errorMessageService: this.errorMessageService,
        errorCode: ErrorCode.EMAIL_SEND_FAILED,
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        logMessage: 'Failed to send email',
        logContext: {
          recipients,
          subject,
        },
        errorParams: {
          EMAIL: recipientEmail,
        },
      });
    }
  }

  private replaceTemplateVariables(
    template: string,
    variables: Record<string, string>,
  ): string {
    return Object.entries(variables).reduce((html, [key, value]) => {
      return html.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    }, template);
  }

  private generateTextVersion(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private logEtherealPreview(
    recipients: string,
    subject: string,
    previewUrl: string,
  ): void {
    this.logger.log('');
    this.logger.log(
      '═══════════════════════════════════════════════════════════',
    );
    this.logger.log('📧 EMAIL ENVIADO COM SUCESSO (Ethereal)');
    this.logger.log(
      '═══════════════════════════════════════════════════════════',
    );
    this.logger.log(`📬 Para: ${recipients}`);
    this.logger.log(`📝 Assunto: ${subject}`);
    this.logger.log(`🔗 Preview URL: ${previewUrl}`);
    this.logger.log('');
    this.logger.log(
      '💡 Clique no link acima ou copie e cole no navegador para visualizar o email',
    );
    this.logger.log(
      '═══════════════════════════════════════════════════════════',
    );
    this.logger.log('');
  }

  private logSuccessfulSend(
    recipients: string,
    subject: string,
    messageId: string,
    previewUrl?: string,
  ): void {
    const previewInfo = previewUrl ? ` | Preview: ${previewUrl}` : '';
    this.logger.log(
      `Email successfully sent - Subject: "${subject}" | Recipients: ${recipients} | Message ID: ${messageId}${previewInfo}`,
    );
  }
}
