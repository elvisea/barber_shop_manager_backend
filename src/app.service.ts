import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  getHello(): string {
    return 'Barber Shop Manager - Sistema de Gerenciamento de Barbearia!';
  }

  // Exemplos de operações com o banco de dados

  // Buscar todos os clientes
  async getClients() {
    return this.prisma.client.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // Buscar todos os barbeiros ativos
  async getActiveBarbers() {
    return this.prisma.barber.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  // Buscar todos os serviços ativos
  async getActiveServices() {
    return this.prisma.service.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  // Buscar agendamentos recentes
  async getAppointments() {
    return this.prisma.appointment.findMany({
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        barber: {
          select: {
            name: true,
          },
        },
        services: {
          include: {
            service: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        date_time: 'desc',
      },
      take: 10,
    });
  }

  // Exemplo de estatísticas básicas
  async getStats() {
    const [clientsCount, barbersCount, servicesCount, appointmentsCount] = await Promise.all([
      this.prisma.client.count(),
      this.prisma.barber.count({ where: { is_active: true } }),
      this.prisma.service.count({ where: { is_active: true } }),
      this.prisma.appointment.count(),
    ]);

    return {
      clients: clientsCount,
      barbers: barbersCount,
      services: servicesCount,
      appointments: appointmentsCount,
    };
  }

  // Exemplo de criação de cliente
  async createClient(data: { name: string; email: string; phone?: string }) {
    return this.prisma.client.create({
      data,
    });
  }
}
