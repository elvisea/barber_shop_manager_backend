import { Inject, Injectable, Logger } from '@nestjs/common';

import { APPOINTMENT_CREATE_BUSINESS_RULES } from '../constants/appointment-create-rules.token';
import type { IAppointmentCreateBusinessRule } from '../contracts/appointment-create-business-rule.interface';
import { AppointmentCreateRequestDTO } from '../dtos/api/appointment-create-request.dto';
import { AppointmentCreateResponseDTO } from '../dtos/api/appointment-create-response.dto';
import { AppointmentRepositoryMapper } from '../mappers/appointment-repository.mapper';
import { AppointmentToResponseMapper } from '../mappers/appointment-to-response.mapper';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';
import { AppointmentCreateBusinessRulesService } from './appointment-create-business-rules.service';

/**
 * Orchestrates appointment creation in order: (1) establishment access and appointment permission
 * (via AppointmentAccessValidationService, which uses the centralized EstablishmentAccessService),
 * (2) entity validations (customer, member, services exist), (3) extensible business rules
 * (injected list APPOINTMENT_CREATE_BUSINESS_RULES), (4) calculations and conflict checks
 * (AppointmentCreateBusinessRulesService), (5) persistence.
 * Adding new create rules does not require changes here; register the new rule in the module.
 */
@Injectable()
export class AppointmentCreateService {
  private readonly logger = new Logger(AppointmentCreateService.name);

  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly appointmentAccessValidationService: AppointmentAccessValidationService,
    private readonly appointmentCreateBusinessRulesService: AppointmentCreateBusinessRulesService,
    @Inject(APPOINTMENT_CREATE_BUSINESS_RULES)
    private readonly createBusinessRules: IAppointmentCreateBusinessRule[],
  ) {}

  /**
   * Creates an appointment. Flow: (1) access + permission, (2) entity validations,
   * (3) extensible rules, (4) totals and conflicts, (5) persist and map response.
   */
  async execute(
    dto: AppointmentCreateRequestDTO,
    establishmentId: string,
    ownerId: string,
  ): Promise<AppointmentCreateResponseDTO> {
    this.logger.log(
      `Creating appointment for customer ${dto.customerId} in establishment ${establishmentId}`,
    );

    // 1. Establishment access + appointment permission (centralized access + who can act for whom)
    const accessResult =
      await this.appointmentAccessValidationService.validateCanCreate(
        establishmentId,
        ownerId,
      );

    // 2. Requester can act for target member (OWNER/RECEPTIONIST = any; BARBER/HAIRDRESSER = self only)
    this.appointmentAccessValidationService.assertRequesterCanActForMember(
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

    // 6. Extensible business rules (e.g. member services allowed)
    const ruleContext = {
      establishmentId,
      userId: dto.userId,
      serviceIds: dto.serviceIds,
    };
    for (const rule of this.createBusinessRules) {
      await rule.validate(ruleContext);
    }

    // 7. Calcular totais e endTime baseado nos serviços
    const { totalAmount, totalDuration, endTime } =
      this.appointmentCreateBusinessRulesService.calculateTotalsAndEndTime(
        dto.startTime,
        establishmentServices,
      );

    // 8. Validar conflito de horários
    await this.appointmentCreateBusinessRulesService.validateNoTimeConflict(
      dto.userId,
      dto.startTime,
      new Date(endTime),
    );

    // 9. Validar horários
    this.appointmentCreateBusinessRulesService.validateTimeRange(
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
