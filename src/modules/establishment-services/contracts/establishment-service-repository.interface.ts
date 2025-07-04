import { EstablishmentService } from '@prisma/client';

import { EstablishmentServiceCreateRequestDTO } from '../dtos/establishment-service-create-request.dto';

export interface IEstablishmentServiceRepository {
  createService(
    data: EstablishmentServiceCreateRequestDTO,
    establishmentId: string,
  ): Promise<EstablishmentService>;

  findByIdAndEstablishment(
    serviceId: string,
    establishmentId: string,
  ): Promise<EstablishmentService | null>;

  findAllByEstablishmentPaginated(params: {
    establishmentId: string;
    skip: number;
    take: number;
  }): Promise<{ data: EstablishmentService[]; total: number }>;

  updateService(
    serviceId: string,
    establishmentId: string,
    data: Partial<EstablishmentServiceCreateRequestDTO>,
  ): Promise<EstablishmentService>;

  deleteService(serviceId: string, establishmentId: string): Promise<void>;

  existsByName(establishmentId: string, name: string): Promise<boolean>;
}
