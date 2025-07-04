import { Injectable, Logger } from '@nestjs/common';

import { EstablishmentServiceFindAllQueryDTO } from '../dtos/establishment-service-find-all-query.dto';
import { EstablishmentServiceFindAllResponseDTO } from '../dtos/establishment-service-find-all-response.dto';
import { EstablishmentServiceRepository } from '../repositories/establishment-service.repository';

import { EstablishmentMembershipService } from '@/modules/establishment/services/establishment-membership.service';

@Injectable()
export class EstablishmentServiceFindAllService {
  private readonly logger = new Logger(EstablishmentServiceFindAllService.name);

  constructor(
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly establishmentMembershipService: EstablishmentMembershipService,
  ) {}

  async execute(
    query: EstablishmentServiceFindAllQueryDTO,
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentServiceFindAllResponseDTO> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Finding all services for establishment ${establishmentId} by user ${userId} with page ${page}, limit ${limit}`,
    );

    await this.establishmentMembershipService.validateMembership(
      establishmentId,
      userId,
    );

    const { data, total } =
      await this.establishmentServiceRepository.findAllByEstablishmentPaginated(
        {
          establishmentId,
          skip,
          take: limit,
        },
      );

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        commission: Number(service.commission),
        establishmentId: service.establishmentId,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      })),
      meta: {
        page,
        limit,
        total: {
          items: total,
          pages: totalPages,
        },
      },
    };
  }
}
