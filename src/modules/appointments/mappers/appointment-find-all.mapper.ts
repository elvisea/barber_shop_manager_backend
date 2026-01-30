import { AppointmentFindAllQueryDTO } from '../dtos/api/appointment-find-all-query.dto';
import { AppointmentFindAllResponseDTO } from '../dtos/api/appointment-find-all-response.dto';
import { AppointmentRepositoryFindAllDTO } from '../dtos/repository/appointment-repository-find-all.dto';
import { AppointmentWithRelations } from '../types/appointment-with-relations.type';
import { PaginationResult } from '../utils/pagination.util';

export class AppointmentFindAllMapper {
  /**
   * Converte DTO de entrada para DTO do repositório
   */
  static toRepositoryQuery(
    establishmentId: string,
    query: AppointmentFindAllQueryDTO,
    pagination: PaginationResult,
  ): AppointmentRepositoryFindAllDTO {
    return {
      establishmentId,
      customerId: query.customerId,
      userId: query.userId,
      status: query.status,
      startDate: query.startDate,
      endDate: query.endDate,
      includeDeleted: query.includeDeleted ?? false,
      skip: pagination.skip,
      take: pagination.limit,
    };
  }

  /**
   * Converte dados do repositório para DTO de resposta.
   * O repositório retorna appointments com include customer/user; cast interno para acessar nomes.
   */
  static toResponseDTO(
    appointments: AppointmentWithRelations[],
    pagination: PaginationResult,
    totalItems: number,
  ): AppointmentFindAllResponseDTO {
    const appointmentItems = appointments.map((apt) => ({
      id: apt.id,
      customerId: apt.customerId,
      customerName: apt.customer?.name ?? '',
      userId: apt.userId,
      memberName: apt.user?.name ?? '',
      startTime: apt.startTime.toISOString(),
      endTime: apt.endTime.toISOString(),
      totalAmount: apt.totalAmount,
      totalDuration: apt.totalDuration,
      status: apt.status,
      notes: apt.notes ?? undefined,
    }));

    return new AppointmentFindAllResponseDTO(
      appointmentItems,
      pagination.page,
      pagination.limit,
      totalItems,
    );
  }
}
