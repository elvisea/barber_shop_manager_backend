import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Endpoints para demonstrar o uso do Prisma

  @Get('clients')
  async getClients() {
    return this.appService.getClients();
  }

  @Get('barbers')
  async getBarbers() {
    return this.appService.getActiveBarbers();
  }

  @Get('services')
  async getServices() {
    return this.appService.getActiveServices();
  }

  @Get('appointments')
  async getAppointments() {
    return this.appService.getAppointments();
  }

  @Get('stats')
  async getStats() {
    return this.appService.getStats();
  }

  @Post('clients')
  async createClient(@Body() data: { name: string; email: string; phone?: string }) {
    return this.appService.createClient(data);
  }
}
