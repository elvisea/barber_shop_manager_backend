import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { AppointmentCreateResponseDTO } from '../dtos/api/appointment-create-response.dto';
import { AppointmentUpdateRequestDTO } from '../dtos/api/appointment-update-request.dto';
import { AppointmentRepositoryMapper } from '../mappers/appointment-repository.mapper';
import { AppointmentToResponseMapper } from '../mappers/appointment-to-response.mapper';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';
import { AppointmentUpdateBusinessRulesService } from './appointment-update-business-rules.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

/**
 * Service responsável pela atualização de agendamentos.
 * Delega regras de negócio (effective values e validações condicionais)
 * ao AppointmentUpdateBusinessRulesService.
 */
@Injectable()
export class AppointmentUpdateService {
  private readonly logger = new Logger(AppointmentUpdateService.name);

  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly appointmentAccessValidationService: AppointmentAccessValidationService,
    private readonly appointmentUpdateBusinessRulesService: AppointmentUpdateBusinessRulesService,
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

    const accessResult =
      await this.appointmentAccessValidationService.validateCanCreate(
        establishmentId,
        ownerId,
      );

    this.appointmentAccessValidationService.assertRequesterCanActForMember(
      accessResult,
      ownerId,
      appointment.userId,
    );

    const resolved =
      await this.appointmentUpdateBusinessRulesService.resolveAndValidateUpdate(
        dto,
        appointment,
        { establishmentId, ownerId, accessResult },
      );

    const repositoryUpdate = AppointmentRepositoryMapper.toRepositoryUpdateDTO({
      userId: resolved.effectiveUserId,
      startTime: resolved.effectiveStartTime,
      endTime: resolved.endTime,
      totalAmount: resolved.totalAmount,
      totalDuration: resolved.totalDuration,
      status: resolved.effectiveStatus,
      notes: resolved.effectiveNotes,
      establishmentServices: resolved.establishmentServicesForUpdate,
    });

    const updated = await this.appointmentRepository.update(
      appointmentId,
      repositoryUpdate,
    );

    this.logger.log(`Appointment updated successfully: ${updated.id}`);

    return AppointmentToResponseMapper.toResponseDTO(updated);
  }
}
