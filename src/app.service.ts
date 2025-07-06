import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    const now = new Date();
    const env = process.env.NODE_ENV || 'development';
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
