import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AppointmentStatus, EstablishmentService } from '@prisma/client';

import { AppointmentCreateRequestDTO } from '../dtos/api/appointment-create-request.dto';
import { AppointmentCreateResponseDTO } from '../dtos/api/appointment-create-response.dto';
import { AppointmentRepositoryCreateDTO } from '../dtos/repository/appointment-repository-create.dto';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

/**
 * Service responsável pela criação de agendamentos
 */
@Injectable()
export class AppointmentCreateService {
  private readonly logger = new Logger(AppointmentCreateService.name);

  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly appointmentAccessValidationService: AppointmentAccessValidationService,
    private readonly errorMessageService: ErrorMessageService,
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
    const { establishment, isOwner, member } =
      await this.appointmentAccessValidationService.validateUserCanCreateAppointments(
        establishmentId,
        ownerId,
      );

    // 2. Validar cliente existe no estabelecimento
    await this.appointmentAccessValidationService.validateCustomer(
      establishmentId,
      dto.customerId,
    );

    // 3. Validar membro existe no estabelecimento
    await this.appointmentAccessValidationService.validateMember(
      establishmentId,
      dto.memberId,
    );

    // 4. Validar e buscar serviços do estabelecimento
    const establishmentServices =
      await this.appointmentAccessValidationService.validateServices(
        establishmentId,
        dto.serviceIds,
      );

    // 5. Validar se os serviços são permitidos ao membro
    await this.appointmentAccessValidationService.validateMemberAllowedServices(
      establishmentId,
      dto.memberId,
      dto.serviceIds,
    );

    // 6. Calcular totais e endTime baseado nos serviços
    const { totalAmount, totalDuration, endTime } =
      this.calculateTotalsAndEndTime(dto.startTime, establishmentServices);

    // 7. Validar horários
    this.validateTimeRange(dto.startTime, endTime);

    // 8. Criar dados para o repositório
    const repositoryData: AppointmentRepositoryCreateDTO = {
      customerId: dto.customerId,
      memberId: dto.memberId,
      establishmentId,
      startTime: new Date(dto.startTime),
      endTime: new Date(endTime),
      totalAmount,
      totalDuration,
      status: AppointmentStatus.PENDING,
      notes: dto.notes,
    };

    // 9. Criar agendamento no banco
    const appointment = await this.appointmentRepository.create(repositoryData);

    this.logger.log(
      `Appointment created successfully with ID: ${appointment.id}`,
    );

    // 10. Retornar resposta
    return {
      id: appointment.id,
      establishmentId: appointment.establishmentId,
      customerId: appointment.customerId,
      memberId: appointment.memberId,
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
      totalAmount: appointment.totalAmount,
      totalDuration: appointment.totalDuration,
      status: appointment.status,
      notes: appointment.notes || undefined,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }

  /**
   * Valida se o horário de início é anterior ao horário de fim
   */
  private validateTimeRange(startTime: string, endTime: string): void {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.INVALID_TIME_RANGE,
        { START_TIME: startTime, END_TIME: endTime },
      );

      this.logger.warn(`Invalid time range: ${startTime} >= ${endTime}`);

      throw new CustomHttpException(
        message,
        HttpStatus.BAD_REQUEST,
        ErrorCode.INVALID_TIME_RANGE,
      );
    }

    this.logger.log(`Time range validated: ${startTime} < ${endTime}`);
  }

  /**
   * Calcula o valor total, duração total e horário de fim baseado nos serviços
   */
  private calculateTotalsAndEndTime(
    startTime: string,
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

    // Calcular endTime baseado no startTime + totalDuration
    const start = new Date(startTime);
    const end = new Date(start.getTime() + totalDuration * 60000); // 60000ms = 1 minuto
    const endTime = end.toISOString();

    this.logger.log(
      `Calculated totals: amount=${totalAmount}, duration=${totalDuration} minutes, endTime=${endTime}`,
    );

    return { totalAmount, totalDuration, endTime };
  }
}
