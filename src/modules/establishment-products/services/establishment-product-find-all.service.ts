import { Injectable, Logger } from '@nestjs/common';

import { EstablishmentProductFindAllQueryDTO } from '../dtos/establishment-product-find-all-query.dto';
import { EstablishmentProductFindAllResponseDTO } from '../dtos/establishment-product-find-all-response.dto';
import { EstablishmentProductRepository } from '../repositories/establishment-product.repository';

import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class EstablishmentProductFindAllService {
  private readonly logger = new Logger(EstablishmentProductFindAllService.name);

  constructor(
    private readonly establishmentProductRepository: EstablishmentProductRepository,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) {}

  async execute(
    query: EstablishmentProductFindAllQueryDTO,
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentProductFindAllResponseDTO> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Finding all products for establishment ${establishmentId} by user ${userId} with page ${page}, limit ${limit}`,
    );

    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      userId,
    );

    const { data, total } =
      await this.establishmentProductRepository.findAllByEstablishmentPaginated(
        {
          establishmentId,
          skip,
          take: limit,
        },
      );

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((product) => ({
        ...product,
        commission: Number(product.commission),
        description: product.description || undefined,
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
