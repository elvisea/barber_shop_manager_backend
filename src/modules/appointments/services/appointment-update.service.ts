import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EstablishmentService } from '@prisma/client';

import { AppointmentCreateResponseDTO } from '../dtos/api/appointment-create-response.dto';
import { AppointmentUpdateRequestDTO } from '../dtos/api/appointment-update-request.dto';
import { AppointmentRepositoryMapper } from '../mappers/appointment-repository.mapper';
import { AppointmentToResponseMapper } from '../mappers/appointment-to-response.mapper';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';
import { AppointmentBusinessRulesService } from './appointment-business-rules.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

/**
 * Service responsável pela atualização de agendamentos.
 * Reutiliza as mesmas regras de negócio do create (via AppointmentBusinessRulesService).
 */
@Injectable()
export class AppointmentUpdateService {
  private readonly logger = new Logger(AppointmentUpdateService.name);

  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly appointmentAccessValidationService: AppointmentAccessValidationService,
    private readonly appointmentBusinessRulesService: AppointmentBusinessRulesService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Atualiza um agendamento existente com validações de negócio.
   */
  async execute(
    establishmentId: string,
    appointmentId: string,
    dto: AppointmentUpdateRequestDTO,
    ownerId: string,
  ): Promise<AppointmentCreateResponseDTO> {
    this.logger.log(
      `Updating appointment ${appointmentId} in establishment ${establishmentId}`,
    );

    // 1. Buscar agendamento e validar que pertence ao estabelecimento
    const appointment =
      await this.appointmentRepository.findById(appointmentId);

    if (!appointment || appointment.establishmentId !== establishmentId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.APPOINTMENT_NOT_FOUND,
        { APPOINTMENT_ID: appointmentId },
      );
      this.logger.warn(
        `Appointment ${appointmentId} not found or does not belong to establishment ${establishmentId}`,
      );
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.APPOINTMENT_NOT_FOUND,
      );
    }

    // 2. Validar acesso do usuário (dono OU membro do estabelecimento)
    const accessResult =
      await this.appointmentAccessValidationService.validateUserCanCreateAppointments(
        establishmentId,
        ownerId,
      );

    // 3. Validar se o requisitante pode atuar sobre o agendamento (OWNER/RECEPTIONIST = qualquer; HAIRDRESSER/BARBER = só o próprio)
    this.appointmentAccessValidationService.validateRequesterCanActForMember(
      accessResult,
      ownerId,
      appointment.userId,
    );

    // 4. Montar payload efetivo mesclando agendamento existente com o DTO
    const effectiveUserId = dto.userId ?? appointment.userId;

    if (effectiveUserId !== appointment.userId) {
      this.appointmentAccessValidationService.validateRequesterCanActForMember(
        accessResult,
        ownerId,
        effectiveUserId,
      );
    }

    const effectiveStartTime = dto.startTime ?? appointment.startTime;
    const currentServiceIds: string[] = appointment.services
      .map((s) => s.serviceId)
      .sort();
    const effectiveServiceIds: string[] = (dto.serviceIds ?? currentServiceIds)
      .slice()
      .sort();
    const effectiveStatus = dto.status ?? appointment.status;
    const effectiveNotes =
      dto.notes !== undefined ? dto.notes : appointment.notes;

    const servicesChanged =
      dto.serviceIds !== undefined &&
      (currentServiceIds.length !== effectiveServiceIds.length ||
        currentServiceIds.some((id, i) => id !== effectiveServiceIds[i]));

    let totalAmount = appointment.totalAmount;
    let totalDuration = appointment.totalDuration;
    let endTime = appointment.endTime.toISOString();
    let establishmentServicesForUpdate: EstablishmentService[] | undefined;

    if (servicesChanged) {
      establishmentServicesForUpdate =
        await this.appointmentAccessValidationService.validateServices(
          establishmentId,
          effectiveServiceIds,
        );
      await this.appointmentAccessValidationService.validateUserAllowedServices(
        establishmentId,
        effectiveUserId,
        effectiveServiceIds,
      );
      const calculated =
        this.appointmentBusinessRulesService.calculateTotalsAndEndTime(
          effectiveStartTime,
          establishmentServicesForUpdate,
        );
      totalAmount = calculated.totalAmount;
      totalDuration = calculated.totalDuration;
      endTime = calculated.endTime;
    }

    if (effectiveUserId !== appointment.userId) {
      await this.appointmentAccessValidationService.validateUser(
        establishmentId,
        effectiveUserId,
      );
    }

    this.appointmentBusinessRulesService.validateTimeRange(
      effectiveStartTime,
      endTime,
    );

    await this.appointmentBusinessRulesService.validateNoTimeConflict(
      effectiveUserId,
      effectiveStartTime,
      new Date(endTime),
      appointment.id,
    );

    const repositoryUpdate = AppointmentRepositoryMapper.toRepositoryUpdateDTO({
      userId: effectiveUserId,
      startTime: effectiveStartTime,
      endTime,
      totalAmount,
      totalDuration,
      status: effectiveStatus,
      notes: effectiveNotes ?? undefined,
      establishmentServices: establishmentServicesForUpdate,
    });

    const updated = await this.appointmentRepository.update(
      appointmentId,
      repositoryUpdate,
    );

    this.logger.log(`Appointment updated successfully: ${updated.id}`);

    return AppointmentToResponseMapper.toResponseDTO(updated);
  }
}
