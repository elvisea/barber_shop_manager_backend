import { Injectable, Logger } from '@nestjs/common';
import { Appointment, Prisma } from '@prisma/client';

import { IAppointmentRepository } from '../contracts/appointment-repository.interface';
import { AppointmentFindAllQueryDTO } from '../dtos/api/appointment-find-all-query.dto';
import { AppointmentUpdateRequestDTO } from '../dtos/api/appointment-update-request.dto';
import { AppointmentRepositoryCreateDTO } from '../dtos/repository/appointment-repository-create.dto';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AppointmentRepository implements IAppointmentRepository {
  private readonly logger = new Logger(AppointmentRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(data: AppointmentRepositoryCreateDTO): Promise<Appointment> {
    this.logger.log(
      `Criando agendamento para cliente ${data.customerId} no estabelecimento ${data.establishmentId}`,
    );

    const appointment = await this.prismaService.appointment.create({
      data,
      include: {
        customer: true,
        member: true,
        establishment: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    this.logger.log(`Agendamento criado com ID: ${appointment.id}`);
    return appointment;
  }

  async findById(id: string): Promise<Appointment | null> {
    this.logger.log(`Buscando agendamento por ID: ${id}`);

    const appointment = await this.prismaService.appointment.findUnique({
      where: { id },
      include: {
        customer: true,
        member: true,
        establishment: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    if (appointment) {
      this.logger.log(`Agendamento encontrado: ${id}`);
    } else {
      this.logger.warn(`Agendamento não encontrado: ${id}`);
    }

    return appointment;
  }

  async findAll(query: AppointmentFindAllQueryDTO): Promise<Appointment[]> {
    this.logger.log(
      `Buscando agendamentos com filtros: ${JSON.stringify(query)}`,
    );

    const where: Prisma.AppointmentWhereInput = {};

    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.memberId) {
      where.memberId = query.memberId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.startDate || query.endDate) {
      where.startTime = {};
      if (query.startDate) {
        where.startTime.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.startTime.lte = new Date(query.endDate);
      }
    }

    const appointments = await this.prismaService.appointment.findMany({
      where,
      include: {
        customer: true,
        member: true,
        establishment: true,
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      skip: query.page ? (query.page - 1) * (query.limit || 10) : undefined,
      take: query.limit,
    });

    this.logger.log(`Encontrados ${appointments.length} agendamentos`);
    return appointments;
  }

  async update(
    id: string,
    data: AppointmentUpdateRequestDTO,
  ): Promise<Appointment> {
    this.logger.log(`Atualizando agendamento ${id}`);

    const updateData: Prisma.AppointmentUpdateInput = {};

    if (data.memberId) {
      updateData.member = { connect: { id: data.memberId } };
    }

    if (data.startTime) {
      updateData.startTime = new Date(data.startTime);
    }

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    // Note: Atualização de services será feita separadamente no service layer
    // pois precisa dos dados de price, duration e commission do EstablishmentService

    const appointment = await this.prismaService.appointment.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        member: true,
        establishment: true,
        services: {
          include: {
            service: true,
          },
        },
      },
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

  async findByEstablishmentId(establishmentId: string): Promise<Appointment[]> {
    this.logger.log(
      `Buscando agendamentos por estabelecimento: ${establishmentId}`,
    );

    const appointments = await this.prismaService.appointment.findMany({
      where: { establishmentId },
      include: {
        customer: true,
        member: true,
        establishment: true,
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    this.logger.log(
      `Encontrados ${appointments.length} agendamentos para estabelecimento ${establishmentId}`,
    );
    return appointments;
  }

  async findByMemberId(memberId: string): Promise<Appointment[]> {
    this.logger.log(`Buscando agendamentos por membro: ${memberId}`);

    const appointments = await this.prismaService.appointment.findMany({
      where: { memberId },
      include: {
        customer: true,
        member: true,
        establishment: true,
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    this.logger.log(
      `Encontrados ${appointments.length} agendamentos para membro ${memberId}`,
    );
    return appointments;
  }

  async findByCustomerId(customerId: string): Promise<Appointment[]> {
    this.logger.log(`Buscando agendamentos por cliente: ${customerId}`);

    const appointments = await this.prismaService.appointment.findMany({
      where: { customerId },
      include: {
        customer: true,
        member: true,
        establishment: true,
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    this.logger.log(
      `Encontrados ${appointments.length} agendamentos para cliente ${customerId}`,
    );
    return appointments;
  }
}
