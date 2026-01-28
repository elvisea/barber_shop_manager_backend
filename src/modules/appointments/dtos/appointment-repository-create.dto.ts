import { AppointmentStatus } from '@prisma/client';

/**
 * DTO específico para criação de agendamentos no repositório
 * Contém apenas os dados necessários para persistência no banco
 */
export class AppointmentRepositoryCreateDTO {
  customerId: string;
  userId: string;
  establishmentId: string;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  totalDuration: number;
  status: AppointmentStatus;
  notes?: string;
}
