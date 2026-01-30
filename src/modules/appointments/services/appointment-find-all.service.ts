import { Injectable, Logger } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { AppointmentFindAllQueryDTO } from '../dtos/api/appointment-find-all-query.dto';
import { AppointmentFindAllResponseDTO } from '../dtos/api/appointment-find-all-response.dto';
import { AppointmentFindAllMapper } from '../mappers/appointment-find-all.mapper';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { calculatePagination } from '../utils/pagination.util';

import {
  AppointmentAccessValidationService,
  AppointmentAccessValidationResult,
} from './appointment-access-validation.service';

const RESTRICT_TO_OWN_APPOINTMENTS_ROLES: UserRole[] = [
  UserRole.BARBER,
  UserRole.HAIRDRESSER,
];

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
      `[FindAll] Entering execute: establishmentId=${establishmentId}, requesterId=${requesterId}, query=${JSON.stringify(query)}`,
    );

    // 1. Validar se o estabelecimento existe e se o requisitante tem acesso
    const accessResult = await this.validateRequesterAccess(
      establishmentId,
      requesterId,
    );

    const requesterRole = this.getRequesterRole(accessResult);
    this.logger.log(
      `[FindAll] Requester role in establishment: ${requesterRole} (isOwner=${accessResult.isOwner})`,
    );

    // 2. Para BARBER/HAIRDRESSER: restringir à lista do próprio usuário
    const effectiveQuery = { ...query };
    if (RESTRICT_TO_OWN_APPOINTMENTS_ROLES.includes(requesterRole)) {
      effectiveQuery.userId = requesterId;
      this.logger.log(
        `[FindAll] Role ${requesterRole} forces userId filter to requesterId=${requesterId}`,
      );
    }

    // 3. Validar cliente se fornecido
    if (effectiveQuery.customerId) {
      await this.validateCustomer(establishmentId, effectiveQuery.customerId);
    }

    // 4. Validar usuário se fornecido
    if (effectiveQuery.userId) {
      await this.validateUser(establishmentId, effectiveQuery.userId);
    }

    // 5. Calcular paginação
    const pagination = calculatePagination({
      page: effectiveQuery.page,
      limit: effectiveQuery.limit,
    });

    // 6. Converter DTO de entrada para DTO do repositório
    const repositoryQuery = AppointmentFindAllMapper.toRepositoryQuery(
      establishmentId,
      effectiveQuery,
      pagination,
    );

    this.logger.log(
      `[FindAll] Repository query: establishmentId=${repositoryQuery.establishmentId}, userId=${repositoryQuery.userId ?? 'none'}, page=${pagination.page}, limit=${pagination.limit}`,
    );

    // 7. Buscar agendamentos e total no repositório
    const [appointments, total] = await Promise.all([
      this.appointmentRepository.findAll(repositoryQuery),
      this.appointmentRepository.count(repositoryQuery),
    ]);

    this.logger.log(
      `Encontrados ${appointments.length} agendamentos de ${total} total para estabelecimento ${establishmentId}`,
    );

    // 8. Converter para DTO de resposta
    const response = AppointmentFindAllMapper.toResponseDTO(
      appointments,
      pagination,
      total,
    );

    return response;
  }

  private getRequesterRole(
    accessResult: AppointmentAccessValidationResult,
  ): UserRole {
    if (accessResult.isOwner) {
      return UserRole.OWNER;
    }
    return accessResult.userEstablishment!.role;
  }

  private async validateRequesterAccess(
    establishmentId: string,
    requesterId: string,
  ): Promise<AppointmentAccessValidationResult> {
    const result =
      await this.appointmentAccessValidationService.validateUserCanCreateAppointments(
        establishmentId,
        requesterId,
      );
    this.logger.log(
      `Requisitante ${requesterId} tem acesso ao estabelecimento ${establishmentId}`,
    );
    return result;
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

  private async validateUser(
    establishmentId: string,
    userId: string,
  ): Promise<void> {
    await this.appointmentAccessValidationService.validateUser(
      establishmentId,
      userId,
    );
    this.logger.log(
      `Usuário ${userId} validado para estabelecimento ${establishmentId}`,
    );
  }
}
