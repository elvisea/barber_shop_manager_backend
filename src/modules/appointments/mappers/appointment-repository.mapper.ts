import { AppointmentStatus, EstablishmentService } from '@prisma/client';

import { AppointmentRepositoryCreateDTO } from '../dtos/repository/appointment-repository-create.dto';
import { AppointmentRepositoryUpdateDTO } from '../dtos/repository/appointment-repository-update.dto';
import { AppointmentServiceRepositoryCreateDTO } from '../dtos/repository/appointment-service-create.dto';

/**
 * Converte EstablishmentService[] (Prisma) para o formato de serviços do repositório.
 * Reutilizado em create e update quando há lista de serviços.
 */
function mapEstablishmentServicesToRepositoryServices(
  establishmentServices: EstablishmentService[],
): AppointmentServiceRepositoryCreateDTO[] {
  return establishmentServices.map((s) => ({
    serviceId: s.id,
    price: s.price,
    duration: s.duration,
    commission: Number(s.commission),
  }));
}

export interface AppointmentRepositoryCreateMapperParams {
  customerId: string;
  userId: string;
  establishmentId: string;
  startTime: Date;
  endTime: string;
  totalAmount: number;
  totalDuration: number;
  notes?: string;
  establishmentServices: EstablishmentService[];
}

export interface AppointmentRepositoryUpdateMapperParams {
  userId: string;
  startTime: Date;
  endTime: string;
  totalAmount: number;
  totalDuration: number;
  status: AppointmentStatus;
  notes: string | undefined;
  establishmentServices?: EstablishmentService[];
}

/**
 * Mapper para DTOs de create e update do repositório de agendamentos.
 */
export class AppointmentRepositoryMapper {
  /**
   * Monta AppointmentRepositoryCreateDTO para criação de agendamento.
   */
  static toRepositoryCreateDTO(
    params: AppointmentRepositoryCreateMapperParams,
  ): AppointmentRepositoryCreateDTO {
    return {
      customerId: params.customerId,
      userId: params.userId,
      establishmentId: params.establishmentId,
      startTime: params.startTime,
      endTime: new Date(params.endTime),
      totalAmount: params.totalAmount,
      totalDuration: params.totalDuration,
      status: AppointmentStatus.PENDING,
      notes: params.notes,
      services: mapEstablishmentServicesToRepositoryServices(
        params.establishmentServices,
      ),
    };
  }

  /**
   * Monta AppointmentRepositoryUpdateDTO para atualização de agendamento.
   * Se establishmentServices for informado, inclui services no DTO (substituição).
   */
  static toRepositoryUpdateDTO(
    params: AppointmentRepositoryUpdateMapperParams,
  ): AppointmentRepositoryUpdateDTO {
    const dto: AppointmentRepositoryUpdateDTO = {
      userId: params.userId,
      startTime: params.startTime,
      endTime: new Date(params.endTime),
      totalAmount: params.totalAmount,
      totalDuration: params.totalDuration,
      status: params.status,
      notes: params.notes,
    };
    if (params.establishmentServices !== undefined) {
      dto.services = mapEstablishmentServicesToRepositoryServices(
        params.establishmentServices,
      );
    }
    return dto;
  }
}
