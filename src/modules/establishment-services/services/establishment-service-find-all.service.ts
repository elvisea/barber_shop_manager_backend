import { Injectable, Logger } from '@nestjs/common';

import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';
import { ErrorMessageService } from '../../../error-message/error-message.service';
import { EstablishmentServiceFindAllQueryDTO } from '../dtos/establishment-service-find-all-query.dto';
import { EstablishmentServiceFindAllResponseDTO } from '../dtos/establishment-service-find-all-response.dto';
import { EstablishmentServiceRepository } from '../repositories/establishment-service.repository';

@Injectable()
export class EstablishmentServiceFindAllService {
  private readonly logger = new Logger(EstablishmentServiceFindAllService.name);

  constructor(
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly errorMessageService: ErrorMessageService,
  ) { }

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

    this.logger.log(
      `Finding establishment with ID ${establishmentId} for userId=${userId}`,
    );

    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      userId,
    );

    this.logger.log(
      `Establishment ${establishmentId} found for user ${userId}. Proceeding with service find all.`,
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
        ...service,
        commission: Number(service.commission),
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
