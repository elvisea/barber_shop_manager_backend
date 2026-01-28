import { AppointmentStatus } from '@prisma/client';

export class AppointmentRepositoryFindAllDTO {
  customerId?: string;
  userId?: string;
  status?: AppointmentStatus;
  startDate?: Date;
  endDate?: Date;
  includeDeleted?: boolean;
  skip: number;
  take: number;
}
