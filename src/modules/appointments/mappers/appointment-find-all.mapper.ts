import { Appointment } from '@prisma/client';

import { AppointmentFindAllQueryDTO } from '../dtos/api/appointment-find-all-query.dto';
import { AppointmentFindAllResponseDTO } from '../dtos/api/appointment-find-all-response.dto';
import { AppointmentRepositoryFindAllDTO } from '../dtos/repository/appointment-repository-find-all.dto';
import { PaginationResult } from '../utils/pagination.util';

export class AppointmentFindAllMapper {
  /**
   * Converte DTO de entrada para DTO do repositório
   */
  static toRepositoryQuery(
    query: AppointmentFindAllQueryDTO,
    pagination: PaginationResult,
  ): AppointmentRepositoryFindAllDTO {
    return {
      customerId: query.customerId,
      memberId: query.memberId,
      status: query.status,
      startDate: query.startDate,
      endDate: query.endDate,
      includeDeleted: query.includeDeleted ?? false,
      skip: pagination.skip,
      take: pagination.limit,
    };
  }

  /**
   * Converte dados do repositório para DTO de resposta
   */
  static toResponseDTO(
    appointments: Appointment[],
    pagination: PaginationResult,
  ): AppointmentFindAllResponseDTO {
    const totalItems = appointments.length;
    const totalPages = Math.ceil(totalItems / pagination.limit);

    return {
      data: appointments.map((appointment) => ({
        id: appointment.id,
        customerId: appointment.customerId,
        memberId: appointment.memberId,
        startTime: appointment.startTime.toISOString(),
        endTime: appointment.endTime.toISOString(),
      })),
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: {
          items: totalItems,
          pages: totalPages,
        },
      },
    };
  }
}
