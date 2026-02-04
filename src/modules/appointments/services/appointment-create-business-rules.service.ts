import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EstablishmentService } from '@prisma/client';

import { AppointmentRepository } from '../repositories/appointment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

/**
 * Regras atômicas de agendamento (conflito de horário, intervalo de tempo,
 * cálculo de totais/endTime). Usado pelo AppointmentCreateService e pelo
 * AppointmentUpdateBusinessRulesService.
 */
@Injectable()
export class AppointmentCreateBusinessRulesService {
  private readonly logger = new Logger(
    AppointmentCreateBusinessRulesService.name,
  );

  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Valida se não há conflito de horários para o membro.
   * Para update, passar excludeAppointmentId para ignorar o próprio agendamento.
   */
  async validateNoTimeConflict(
    userId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string,
  ): Promise<void> {
    const conflictingAppointments =
      await this.appointmentRepository.findConflictingAppointments(
        userId,
        startTime,
        endTime,
        excludeAppointmentId,
      );

    if (conflictingAppointments.length > 0) {
      const conflictingAppointment = conflictingAppointments[0];

      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_APPOINTMENT_CONFLICT,
        {
          MEMBER_ID: userId,
          START_TIME: conflictingAppointment.startTime.toISOString(),
          END_TIME: conflictingAppointment.endTime.toISOString(),
        },
      );

      this.logger.warn(
        `Time conflict found for user ${userId}: ${conflictingAppointments.length} conflicting appointments. Conflicting appointment: ${conflictingAppointment.id} (${conflictingAppointment.startTime.toISOString()} - ${conflictingAppointment.endTime.toISOString()})`,
      );

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.MEMBER_APPOINTMENT_CONFLICT,
      );
    }

    this.logger.log(
      `No time conflicts found for user ${userId} between ${startTime.toISOString()} and ${endTime.toISOString()}`,
    );
  }

  /**
   * Valida se o horário de início é anterior ao horário de fim.
   */
  validateTimeRange(startTime: Date, endTime: string): void {
    const start = startTime;
    const end = new Date(endTime);

    if (start >= end) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.INVALID_TIME_RANGE,
        { START_TIME: startTime.toISOString(), END_TIME: endTime },
      );

      this.logger.warn(
        `Invalid time range: ${startTime.toISOString()} >= ${endTime}`,
      );

      throw new CustomHttpException(
        message,
        HttpStatus.BAD_REQUEST,
        ErrorCode.INVALID_TIME_RANGE,
      );
    }

    this.logger.log(
      `Time range validated: ${startTime.toISOString()} < ${endTime}`,
    );
  }

  /**
   * Calcula o valor total, duração total e horário de fim baseado nos serviços.
   */
  calculateTotalsAndEndTime(
    startTime: Date,
    services: EstablishmentService[],
  ): {
    totalAmount: number;
    totalDuration: number;
    endTime: string;
  } {
    const totalAmount = services.reduce(
      (sum, service) => sum + service.price,
      0,
    );
    const totalDuration = services.reduce(
      (sum, service) => sum + service.duration,
      0,
    );

    const end = new Date(startTime.getTime() + totalDuration * 60000);
    const endTime = end.toISOString();

    this.logger.log(
      `Calculated totals: amount=${totalAmount}, duration=${totalDuration} minutes, endTime=${endTime}`,
    );

    return { totalAmount, totalDuration, endTime };
  }
}
