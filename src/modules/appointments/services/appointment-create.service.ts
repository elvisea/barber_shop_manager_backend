import { Injectable, Logger } from '@nestjs/common';

import { AppointmentCreateRequestDTO } from '../dtos/api/appointment-create-request.dto';
import { AppointmentCreateResponseDTO } from '../dtos/api/appointment-create-response.dto';
import { AppointmentRepositoryMapper } from '../mappers/appointment-repository.mapper';
import { AppointmentToResponseMapper } from '../mappers/appointment-to-response.mapper';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';
import { AppointmentBusinessRulesService } from './appointment-business-rules.service';

/**
 * Service responsável pela criação de agendamentos
 */
@Injectable()
export class AppointmentCreateService {
  private readonly logger = new Logger(AppointmentCreateService.name);

  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly appointmentAccessValidationService: AppointmentAccessValidationService,
    private readonly appointmentBusinessRulesService: AppointmentBusinessRulesService,
  ) {}

  /**
   * Cria um novo agendamento com validações de negócio
   */
  async execute(
    dto: AppointmentCreateRequestDTO,
    establishmentId: string,
    ownerId: string,
  ): Promise<AppointmentCreateResponseDTO> {
    this.logger.log(
      `Creating appointment for customer ${dto.customerId} in establishment ${establishmentId}`,
    );

    // 1. Validar acesso do usuário (dono OU membro do estabelecimento)
    const accessResult =
      await this.appointmentAccessValidationService.validateUserCanCreateAppointments(
        establishmentId,
        ownerId,
      );

    // 2. Validar se o requisitante pode atuar para o membro do agendamento (OWNER/RECEPTIONIST = qualquer; HAIRDRESSER/BARBER = só si mesmo)
    this.appointmentAccessValidationService.validateRequesterCanActForMember(
      accessResult,
      ownerId,
      dto.userId,
    );

    // 3. Validar cliente existe no estabelecimento
    await this.appointmentAccessValidationService.validateCustomer(
      establishmentId,
      dto.customerId,
    );

    // 4. Validar usuário existe no estabelecimento
    await this.appointmentAccessValidationService.validateUser(
      establishmentId,
      dto.userId,
    );

    // 5. Validar e buscar serviços do estabelecimento
    const establishmentServices =
      await this.appointmentAccessValidationService.validateServices(
        establishmentId,
        dto.serviceIds,
      );

    // 6. Validar se os serviços são permitidos ao usuário
    await this.appointmentAccessValidationService.validateUserAllowedServices(
      establishmentId,
      dto.userId,
      dto.serviceIds,
    );

    // 7. Calcular totais e endTime baseado nos serviços
    const { totalAmount, totalDuration, endTime } =
      this.appointmentBusinessRulesService.calculateTotalsAndEndTime(
        dto.startTime,
        establishmentServices,
      );

    // 8. Validar conflito de horários
    await this.appointmentBusinessRulesService.validateNoTimeConflict(
      dto.userId,
      dto.startTime,
      new Date(endTime),
    );

    // 9. Validar horários
    this.appointmentBusinessRulesService.validateTimeRange(
      dto.startTime,
      endTime,
    );

    // 10. Criar dados para o repositório
    const repositoryData = AppointmentRepositoryMapper.toRepositoryCreateDTO({
      customerId: dto.customerId,
      userId: dto.userId,
      establishmentId,
      startTime: dto.startTime,
      endTime,
      totalAmount,
      totalDuration,
      notes: dto.notes,
      establishmentServices,
    });

    // 11. Criar agendamento no banco
    const appointment = await this.appointmentRepository.create(repositoryData);

    this.logger.log(
      `Appointment created successfully with ID: ${appointment.id}`,
    );

    // 12. Retornar resposta com nomes para exibição no card
    return AppointmentToResponseMapper.toResponseDTO(appointment);
  }
}
