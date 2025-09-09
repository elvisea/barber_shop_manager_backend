import { Injectable, Logger } from '@nestjs/common';

import { AppointmentFindAllQueryDTO } from '../dtos/api/appointment-find-all-query.dto';
import { AppointmentFindAllResponseDTO } from '../dtos/api/appointment-find-all-response.dto';
import { AppointmentRepositoryFindAllDTO } from '../dtos/repository/appointment-repository-find-all.dto';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class AppointmentFindAllService {
  private readonly logger: Logger = new Logger(AppointmentFindAllService.name);

  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    establishmentId: string,
    query: AppointmentFindAllQueryDTO,
    ownerId: string,
  ): Promise<AppointmentFindAllResponseDTO> {
    this.logger.log(
      `Buscando agendamentos para estabelecimento ${establishmentId} com filtros: ${JSON.stringify(query)}`,
    );

    // Validar se o usuário tem acesso ao estabelecimento
    await this.validateEstablishmentAccess(establishmentId, ownerId);

    // Calcular paginação
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Converter DTO de entrada para DTO do repositório
    const repositoryQuery: AppointmentRepositoryFindAllDTO = {
      customerId: query.customerId,
      memberId: query.memberId,
      status: query.status,
      startDate: query.startDate,
      endDate: query.endDate,
      isDeleted: query.isDeleted ?? false,
      skip,
      take: limit,
    };

    // Buscar agendamentos no repositório
    const appointments =
      await this.appointmentRepository.findAll(repositoryQuery);

    this.logger.log(
      `Encontrados ${appointments.length} agendamentos para estabelecimento ${establishmentId}`,
    );

    // Calcular metadados de paginação
    const totalItems = appointments.length;
    const totalPages = Math.ceil(totalItems / limit);

    // Converter para DTO de resposta
    const response: AppointmentFindAllResponseDTO = {
      data: appointments.map((appointment) => ({
        id: appointment.id,
        customerId: appointment.customerId,
        memberId: appointment.memberId,
        startTime: appointment.startTime.toISOString(),
        endTime: appointment.endTime.toISOString(),
      })),
      meta: {
        page,
        limit,
        total: {
          items: totalItems,
          pages: totalPages,
        },
      },
    };

    return response;
  }

  private async validateEstablishmentAccess(
    establishmentId: string,
    ownerId: string,
  ): Promise<void> {
    // TODO: Implementar validação de acesso ao estabelecimento
    // Por enquanto, apenas log da validação
    this.logger.log(
      `Validando acesso do usuário ${ownerId} ao estabelecimento ${establishmentId}`,
    );

    // Esta validação deve ser implementada quando tivermos o service de estabelecimento
    // Por enquanto, assumimos que o acesso é válido
  }
}
