import { Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

import { IAppointmentRepository } from '../contracts/appointment-repository.interface';
import { AppointmentFindAllQueryDTO } from '../dtos/api/appointment-find-all-query.dto';
import { AppointmentFindAllResponseDTO } from '../dtos/api/appointment-find-all-response.dto';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
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

    // Aplicar filtro de agendamentos não deletados
    const queryWithFilters = {
      ...query,
      isDeleted: false,
    };

    // Buscar agendamentos no repositório
    const appointments =
      await this.appointmentRepository.findAll(queryWithFilters);

    this.logger.log(
      `Encontrados ${appointments.length} agendamentos para estabelecimento ${establishmentId}`,
    );

    // Converter para DTO de resposta
    const response: AppointmentFindAllResponseDTO = {
      items: appointments.map((appointment) => ({
        id: appointment.id,
        customerId: appointment.customerId,
        memberId: appointment.memberId,
        startTime: appointment.startTime.toISOString(),
        endTime: appointment.endTime.toISOString(),
      })),
      total: appointments.length,
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
