import {
  AppointmentCreateResponseDTO,
  AppointmentServiceItemDTO,
} from '../dtos/api/appointment-create-response.dto';
import { AppointmentWithRelations } from '../types/appointment-with-relations.type';

/**
 * Mapper para converter AppointmentWithRelations em DTO de resposta de create/update.
 * Create e update retornam o mesmo formato.
 */
export class AppointmentToResponseMapper {
  static toResponseDTO(
    appointment: AppointmentWithRelations,
  ): AppointmentCreateResponseDTO {
    const services = appointment.services
      ?.filter((s) => s.deletedAt == null)
      .map(
        (s): AppointmentServiceItemDTO => ({
          serviceId: s.serviceId,
          price: s.price,
          duration: s.duration,
          commission: Number(s.commission),
        }),
      );

    return {
      id: appointment.id,
      establishmentId: appointment.establishmentId,
      customerId: appointment.customerId,
      customerName: appointment.customer?.name ?? '',
      userId: appointment.userId,
      memberName: appointment.user?.name ?? '',
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
      totalAmount: appointment.totalAmount,
      totalDuration: appointment.totalDuration,
      status: appointment.status,
      notes: appointment.notes ?? undefined,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      ...(services != null && services.length > 0 && { services }),
    };
  }
}
