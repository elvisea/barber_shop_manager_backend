import { Injectable, Logger } from '@nestjs/common';

import { AppointmentFindAllQueryDTO } from '../dtos/api/appointment-find-all-query.dto';
import { AppointmentFindAllResponseDTO } from '../dtos/api/appointment-find-all-response.dto';
import { AppointmentFindAllMapper } from '../mappers/appointment-find-all.mapper';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { calculatePagination } from '../utils/pagination.util';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';

@Injectable()
export class AppointmentFindAllService {
  private readonly logger: Logger = new Logger(AppointmentFindAllService.name);

  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly appointmentAccessValidationService: AppointmentAccessValidationService,
  ) {}

  async execute(
    establishmentId: string,
    query: AppointmentFindAllQueryDTO,
    requesterId: string,
  ): Promise<AppointmentFindAllResponseDTO> {
    this.logger.log(
      `Buscando agendamentos para estabelecimento ${establishmentId} com filtros: ${JSON.stringify(query)}`,
    );

    // 1. Validar se o estabelecimento existe e se o requisitante tem acesso
    await this.validateRequesterAccess(establishmentId, requesterId);

    // 2. Validar cliente se fornecido
    if (query.customerId) {
      await this.validateCustomer(establishmentId, query.customerId);
    }

    // 3. Validar membro se fornecido
    if (query.memberId) {
      await this.validateMember(establishmentId, query.memberId);
    }

    // 4. Calcular paginação
    const pagination = calculatePagination({
      page: query.page,
      limit: query.limit,
    });

    // 5. Converter DTO de entrada para DTO do repositório
    const repositoryQuery = AppointmentFindAllMapper.toRepositoryQuery(
      query,
      pagination,
    );

    // 6. Buscar agendamentos e total no repositório
    const [appointments, total] = await Promise.all([
      this.appointmentRepository.findAll(repositoryQuery),
      this.appointmentRepository.count(repositoryQuery),
    ]);

    this.logger.log(
      `Encontrados ${appointments.length} agendamentos de ${total} total para estabelecimento ${establishmentId}`,
    );

    // 7. Converter para DTO de resposta
    const response = AppointmentFindAllMapper.toResponseDTO(
      appointments,
      pagination,
      total,
    );

    return response;
  }

  private async validateRequesterAccess(
    establishmentId: string,
    requesterId: string,
  ): Promise<void> {
    await this.appointmentAccessValidationService.validateUserCanCreateAppointments(
      establishmentId,
      requesterId,
    );
    this.logger.log(
      `Requisitante ${requesterId} tem acesso ao estabelecimento ${establishmentId}`,
    );
  }

  private async validateCustomer(
    establishmentId: string,
    customerId: string,
  ): Promise<void> {
    await this.appointmentAccessValidationService.validateCustomer(
      establishmentId,
      customerId,
    );
    this.logger.log(
      `Cliente ${customerId} validado para estabelecimento ${establishmentId}`,
    );
  }

  private async validateMember(
    establishmentId: string,
    memberId: string,
  ): Promise<void> {
    await this.appointmentAccessValidationService.validateMember(
      establishmentId,
      memberId,
    );
    this.logger.log(
      `Membro ${memberId} validado para estabelecimento ${establishmentId}`,
    );
  }
}
