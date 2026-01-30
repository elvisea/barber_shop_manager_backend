import { AppointmentStatus } from '@prisma/client';

import { AppointmentServiceRepositoryCreateDTO } from './appointment-service-create.dto';

/**
 * DTO para atualização de agendamento no repositório.
 * Campos opcionais; services substitui os AppointmentService do agendamento quando informado.
 */
export class AppointmentRepositoryUpdateDTO {
  userId?: string;
  startTime?: Date;
  endTime?: Date;
  totalAmount?: number;
  totalDuration?: number;
  status?: AppointmentStatus;
  notes?: string;
  /** Substitui os serviços do agendamento quando informado. */
  services?: AppointmentServiceRepositoryCreateDTO[];
}
