import { AppointmentStatus } from '@prisma/client';

export class AppointmentRepositoryFindAllDTO {
  customerId?: string;
  memberId?: string;
  status?: AppointmentStatus;
  startDate?: Date;
  endDate?: Date;
  isDeleted: boolean;
  skip: number;
  take: number;
}
