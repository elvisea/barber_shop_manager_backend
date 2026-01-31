import { Injectable, Logger } from '@nestjs/common';
import { AppointmentStatus, EstablishmentService } from '@prisma/client';

import { AppointmentUpdateRequestDTO } from '../dtos/api/appointment-update-request.dto';
import { AppointmentWithRelations } from '../types/appointment-with-relations.type';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';
import type { EstablishmentAccessResult } from '@/shared/establishment-access/types/establishment-access-result.type';
import { AppointmentCreateBusinessRulesService } from './appointment-create-business-rules.service';

export interface AppointmentUpdateBusinessRulesContext {
  establishmentId: string;
  ownerId: string;
  accessResult: EstablishmentAccessResult;
}

export interface AppointmentUpdateBusinessRulesResult {
  effectiveUserId: string;
  effectiveStartTime: Date;
  endTime: string;
  totalAmount: number;
  totalDuration: number;
  effectiveStatus: AppointmentStatus;
  effectiveNotes: string | undefined;
  establishmentServicesForUpdate: EstablishmentService[] | undefined;
}

/**
 * Orquestra regras de negócio para atualização de agendamento.
 * Aplica validações e recálculos somente quando o campo foi alterado,
 * delegando regras atômicas ao AppointmentCreateBusinessRulesService.
 */
@Injectable()
export class AppointmentUpdateBusinessRulesService {
  private readonly logger = new Logger(
    AppointmentUpdateBusinessRulesService.name,
  );

  constructor(
    private readonly appointmentCreateBusinessRulesService: AppointmentCreateBusinessRulesService,
    private readonly appointmentAccessValidationService: AppointmentAccessValidationService,
  ) {}

  /**
   * Resolve payload efetivo e aplica regras de negócio para update.
   * Valida e recalcula apenas quando os campos relevantes foram alterados.
   */
  async resolveAndValidateUpdate(
    dto: AppointmentUpdateRequestDTO,
    appointment: AppointmentWithRelations,
    context: AppointmentUpdateBusinessRulesContext,
  ): Promise<AppointmentUpdateBusinessRulesResult> {
    const { establishmentId, ownerId, accessResult } = context;

    const fieldsSent = Object.keys(dto).filter(
      (k) => dto[k as keyof typeof dto] !== undefined,
    );
    this.logger.log(
      `resolveAndValidateUpdate: appointmentId=${appointment.id}, fields sent=[${fieldsSent.join(', ')}]`,
    );

    const effectiveUserId = dto.userId ?? appointment.userId;

    if (effectiveUserId !== appointment.userId) {
      this.logger.log(
        `userId changed: ${appointment.userId} -> ${effectiveUserId}, validating requester can act for new member`,
      );
      this.appointmentAccessValidationService.assertRequesterCanActForMember(
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

    this.logger.log(
      `effective values: userId=${effectiveUserId}, startTime=${effectiveStartTime.toISOString()}, status=${effectiveStatus}, servicesChanged=${servicesChanged}`,
    );

    let totalAmount = appointment.totalAmount;
    let totalDuration = appointment.totalDuration;
    let endTime = appointment.endTime.toISOString();
    let establishmentServicesForUpdate: EstablishmentService[] | undefined;

    if (servicesChanged) {
      this.logger.log(
        `services changed: validating and recalculating totals for serviceIds=[${effectiveServiceIds.join(', ')}]`,
      );
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
        this.appointmentCreateBusinessRulesService.calculateTotalsAndEndTime(
          effectiveStartTime,
          establishmentServicesForUpdate,
        );
      totalAmount = calculated.totalAmount;
      totalDuration = calculated.totalDuration;
      endTime = calculated.endTime;
      this.logger.log(
        `recalculated: totalAmount=${totalAmount}, totalDuration=${totalDuration}min, endTime=${endTime}`,
      );
    }

    if (dto.startTime !== undefined && !servicesChanged) {
      endTime = new Date(
        effectiveStartTime.getTime() + totalDuration * 60000,
      ).toISOString();
      this.logger.log(
        `startTime only changed: endTime recalculated from startTime + ${totalDuration}min -> ${endTime}`,
      );
    }

    if (effectiveUserId !== appointment.userId) {
      this.logger.log(`validating user exists: userId=${effectiveUserId}`);
      await this.appointmentAccessValidationService.validateUser(
        establishmentId,
        effectiveUserId,
      );
    }

    this.logger.log(
      `validating time range: startTime=${effectiveStartTime.toISOString()}, endTime=${endTime}`,
    );
    this.appointmentCreateBusinessRulesService.validateTimeRange(
      effectiveStartTime,
      endTime,
    );

    this.logger.log(
      `validating no time conflict: userId=${effectiveUserId}, excludeAppointmentId=${appointment.id}`,
    );
    await this.appointmentCreateBusinessRulesService.validateNoTimeConflict(
      effectiveUserId,
      effectiveStartTime,
      new Date(endTime),
      appointment.id,
    );

    const result = {
      effectiveUserId,
      effectiveStartTime,
      endTime,
      totalAmount,
      totalDuration,
      effectiveStatus,
      effectiveNotes: effectiveNotes ?? undefined,
      establishmentServicesForUpdate,
    };

    this.logger.log(
      `resolveAndValidateUpdate completed: appointmentId=${appointment.id}, effectiveStatus=${result.effectiveStatus}, endTime=${result.endTime}`,
    );

    return result;
  }
}
