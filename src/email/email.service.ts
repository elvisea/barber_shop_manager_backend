import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) { }

  // Envia um e-mail básico
  async sendEmail(to: string, subject: string, text: string) {
    try {
      this.logger.log(`Tentando enviar email para: ${to}`);

      const from = this.configService.get('MAIL_USER');
      await this.mailerService.sendMail({
        from,
        to,
        subject,
        text,
      });

      this.logger.log(`Email enviado com sucesso para: ${to}`);
    } catch (error) {
      this.logger.error(
        `Erro ao enviar email para ${to}: ${error.message}`,
        error.stack,
      );

      // Re-throw the error to be handled by the calling service
      throw error;
    }
  }

  // Envia um e-mail com template (opcional)
  async sendTemplateEmail(
    to: string,
    subject: string,
    context: Record<string, any>,
  ) {
    try {
      this.logger.log(`Tentando enviar email com template para: ${to}`);

      const from = this.configService.get('MAIL_USER');
      await this.mailerService.sendMail({
        from,
        to,
        subject,
        template: 'welcome',
        context,
      });

      this.logger.log(`Email com template enviado com sucesso para: ${to}`);
    } catch (error) {
      this.logger.error(
        `Erro ao enviar email com template para ${to}: ${error.message}`,
        error.stack,
      );

      // Re-throw the error to be handled by the calling service
      throw error;
    }
  }
}
