import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { IAppointmentRepository } from '../contracts/appointment-repository.interface';
import { AppointmentRepositoryFindAllDTO } from '../dtos';
import { AppointmentRepositoryCreateDTO } from '../dtos/repository/appointment-repository-create.dto';
import { AppointmentRepositoryUpdateDTO } from '../dtos/repository/appointment-repository-update.dto';
import { AppointmentWithRelations } from '../types/appointment-with-relations.type';

import { PrismaService } from '@/prisma/prisma.service';

const appointmentInclude = {
  customer: true,
  user: true,
  establishment: true,
  services: {
    include: {
      service: true,
    },
  },
} as const;

@Injectable()
export class AppointmentRepository implements IAppointmentRepository {
  private readonly logger = new Logger(AppointmentRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: AppointmentRepositoryCreateDTO,
  ): Promise<AppointmentWithRelations> {
    this.logger.log(
      `Criando agendamento para cliente ${data.customerId} no estabelecimento ${data.establishmentId}`,
    );

    const { services, ...appointmentData } = data;

    const appointment = await this.prismaService.appointment.create({
      data: {
        ...appointmentData,
        services: {
          create: [...services],
        },
      },
      include: appointmentInclude,
    });

    this.logger.log(
      `Agendamento criado com ID: ${appointment.id} e ${services.length} serviços associados`,
    );
    return appointment;
  }

  async findById(id: string): Promise<AppointmentWithRelations | null> {
    this.logger.log(`Buscando agendamento por ID: ${id}`);

    const appointment = await this.prismaService.appointment.findUnique({
      where: { id },
      include: appointmentInclude,
    });

    if (appointment) {
      this.logger.log(`Agendamento encontrado: ${id}`);
    } else {
      this.logger.warn(`Agendamento não encontrado: ${id}`);
    }

    return appointment;
  }

  async findAll(
    query: AppointmentRepositoryFindAllDTO,
  ): Promise<AppointmentWithRelations[]> {
    this.logger.log(
      `Buscando agendamentos com filtros: ${JSON.stringify(query)}`,
    );

    const where: Prisma.AppointmentWhereInput = {
      establishmentId: query.establishmentId,
    };

    // Filtrar por status de exclusão lógica
    // Se includeDeleted for false (padrão), retorna apenas registros não deletados (deletedAt IS NULL)
    if (!query.includeDeleted) {
      where.deletedAt = null;
    }

    // Aplicar filtros opcionais
    if (query.customerId) {
      where.customerId = query.customerId;
      this.logger.debug(`Filtro aplicado: customerId = ${query.customerId}`);
    }

    if (query.userId) {
      where.userId = query.userId;
      this.logger.debug(`Filtro aplicado: userId = ${query.userId}`);
    }

    if (query.status) {
      where.status = query.status;
      this.logger.debug(`Filtro aplicado: status = ${query.status}`);
    }

    // Filtro por período de datas
    if (query.startDate || query.endDate) {
      where.startTime = {};
      if (query.startDate) {
        where.startTime.gte = query.startDate;
        this.logger.debug(
          `Filtro aplicado: startDate >= ${query.startDate.toISOString()}`,
        );
      }
      if (query.endDate) {
        where.startTime.lte = query.endDate;
        this.logger.debug(
          `Filtro aplicado: endDate <= ${query.endDate.toISOString()}`,
        );
      }
    }

    this.logger.debug(`Paginação: skip=${query.skip}, take=${query.take}`);

    this.logger.log(
      `[Repository findAll] Effective where: establishmentId=${query.establishmentId}, userId=${query.userId ?? 'none'}, status=${query.status ?? 'none'}, startDate=${query.startDate?.toISOString() ?? 'none'}, endDate=${query.endDate?.toISOString() ?? 'none'}, includeDeleted=${query.includeDeleted}`,
    );

    const appointments = await this.prismaService.appointment.findMany({
      where,
      include: appointmentInclude,
      orderBy: {
        startTime: 'asc',
      },
      skip: query.skip,
      take: query.take,
    });

    this.logger.log(`Encontrados ${appointments.length} agendamentos`);

    return appointments;
  }

  async count(query: AppointmentRepositoryFindAllDTO): Promise<number> {
    this.logger.log(
      `Contando agendamentos com filtros: ${JSON.stringify(query)}`,
    );

    const where: Prisma.AppointmentWhereInput = {
      establishmentId: query.establishmentId,
    };

    // Filtrar por status de exclusão lógica
    if (!query.includeDeleted) {
      where.deletedAt = null;
    }

    // Aplicar filtros opcionais (mesmos do findAll)
    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.status) {
      where.status = query.status;
    }

    // Filtro por período de datas
    if (query.startDate || query.endDate) {
      where.startTime = {};
      if (query.startDate) {
        where.startTime.gte = query.startDate;
      }
      if (query.endDate) {
        where.startTime.lte = query.endDate;
      }
    }

    this.logger.log(
      `[Repository count] Effective where: establishmentId=${query.establishmentId}, userId=${query.userId ?? 'none'}, status=${query.status ?? 'none'}, includeDeleted=${query.includeDeleted}`,
    );

    const total = await this.prismaService.appointment.count({ where });

    this.logger.log(`Total de agendamentos: ${total}`);
    return total;
  }

  async update(
    id: string,
    data: AppointmentRepositoryUpdateDTO,
  ): Promise<AppointmentWithRelations> {
    this.logger.log(`Atualizando agendamento ${id}`);

    const updateData: Prisma.AppointmentUpdateInput = {};

    if (data.userId !== undefined) {
      updateData.user = { connect: { id: data.userId } };
    }

    if (data.startTime !== undefined) {
      updateData.startTime = new Date(data.startTime);
    }

    if (data.endTime !== undefined) {
      updateData.endTime = new Date(data.endTime);
    }

    if (data.totalAmount !== undefined) {
      updateData.totalAmount = data.totalAmount;
    }

    if (data.totalDuration !== undefined) {
      updateData.totalDuration = data.totalDuration;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    if (data.services !== undefined) {
      updateData.services =
        data.services.length > 0
          ? {
              deleteMany: {},
              create: data.services.map((s) => ({
                serviceId: s.serviceId,
                price: s.price,
                duration: s.duration,
                commission: s.commission,
              })),
            }
          : { deleteMany: {} };
    }

    const appointment = await this.prismaService.appointment.update({
      where: { id },
      data: updateData,
      include: appointmentInclude,
    });

    this.logger.log(`Agendamento atualizado: ${id}`);
    return appointment;
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Removendo agendamento ${id}`);

    await this.prismaService.appointment.delete({
      where: { id },
    });

    this.logger.log(`Agendamento removido: ${id}`);
  }

  async findByEstablishmentId(
    establishmentId: string,
  ): Promise<AppointmentWithRelations[]> {
    this.logger.log(
      `Buscando agendamentos por estabelecimento: ${establishmentId}`,
    );

    const appointments = await this.prismaService.appointment.findMany({
      where: { establishmentId },
      include: appointmentInclude,
      orderBy: {
        startTime: 'asc',
      },
    });

    this.logger.log(
      `Encontrados ${appointments.length} agendamentos para estabelecimento ${establishmentId}`,
    );
    return appointments;
  }

  async findByUserId(userId: string): Promise<AppointmentWithRelations[]> {
    this.logger.log(`Buscando agendamentos por usuário: ${userId}`);

    const appointments = await this.prismaService.appointment.findMany({
      where: { userId },
      include: appointmentInclude,
      orderBy: {
        startTime: 'asc',
      },
    });

    this.logger.log(
      `Encontrados ${appointments.length} agendamentos para usuário ${userId}`,
    );
    return appointments;
  }

  async findByCustomerId(
    customerId: string,
  ): Promise<AppointmentWithRelations[]> {
    this.logger.log(`Buscando agendamentos por cliente: ${customerId}`);

    const appointments = await this.prismaService.appointment.findMany({
      where: { customerId },
      include: appointmentInclude,
      orderBy: {
        startTime: 'asc',
      },
    });

    this.logger.log(
      `Encontrados ${appointments.length} agendamentos para cliente ${customerId}`,
    );
    return appointments;
  }

  async findConflictingAppointments(
    userId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string,
  ): Promise<AppointmentWithRelations[]> {
    this.logger.log(
      `Verificando conflitos de horário para usuário ${userId} entre ${startTime.toISOString()} e ${endTime.toISOString()}`,
    );

    const whereClause: Prisma.AppointmentWhereInput = {
      userId,
      deletedAt: null, // Filtrar apenas agendamentos não deletados
      AND: [
        // Conflito: agendamento existente sobrepõe com o novo
        // Condição: startTime < novo_endTime AND endTime > novo_startTime
        {
          startTime: { lt: endTime },
        },
        {
          endTime: { gt: startTime },
        },
      ],
    };

    // Excluir agendamento específico se fornecido (para updates)
    if (excludeAppointmentId) {
      whereClause.id = { not: excludeAppointmentId };
    }

    const conflictingAppointments =
      await this.prismaService.appointment.findMany({
        where: whereClause,
        include: appointmentInclude,
        orderBy: { startTime: 'asc' },
      });

    this.logger.log(
      `Encontrados ${conflictingAppointments.length} agendamentos conflitantes`,
    );
    return conflictingAppointments;
  }
}
