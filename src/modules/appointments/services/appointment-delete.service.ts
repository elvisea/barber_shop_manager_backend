import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { AppointmentRepository } from '../repositories/appointment.repository';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class AppointmentDeleteService {
  private readonly logger = new Logger(AppointmentDeleteService.name);

  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly appointmentAccessValidationService: AppointmentAccessValidationService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    establishmentId: string,
    appointmentId: string,
    requesterId: string,
  ): Promise<void> {
    this.logger.log(
      `Deleting appointment ${appointmentId} in establishment ${establishmentId}`,
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
      await this.appointmentAccessValidationService.validateUserCanCreateAppointments(
        establishmentId,
        requesterId,
      );

    this.appointmentAccessValidationService.validateRequesterCanActForMember(
      accessResult,
      requesterId,
      appointment.userId,
    );

    await this.appointmentRepository.delete(appointmentId, requesterId);

    this.logger.log(`Appointment ${appointmentId} deleted successfully`);
  }
}
