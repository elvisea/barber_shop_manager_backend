import { Prisma } from '@prisma/client';

/**
 * Tipo que representa um Appointment com todos os relacionamentos necessários
 * para create, findById, update, findByEstablishmentId, findByUserId, findByCustomerId e findConflictingAppointments.
 *
 * Garante type-safety e autocomplete em todos os níveis de relacionamento.
 *
 * @see Prisma.AppointmentGetPayload
 */
export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: {
    customer: true;
    user: true;
    establishment: true;
    services: {
      include: {
        service: true;
      };
    };
  };
}>;
