import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Barber Shop Manager - Sistema de Gerenciamento de Barbearia!';
  }
}
