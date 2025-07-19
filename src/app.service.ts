import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    const now = new Date();
    const env = this.configService.get<string>('NODE_ENV', 'development');

    return [
      '💈 Barber Shop Manager API 💈',
      '✅ Status: Online',
      `🌎 Environment: ${env}`,
      `🕒 Date: ${now.toISOString()}`,
      '📚 Docs: /api (Swagger) | /api/docs (Redoc)',
      '🚀 Welcome! Manage your barbershop with ease.',
    ].join(' | ');
  }
}
