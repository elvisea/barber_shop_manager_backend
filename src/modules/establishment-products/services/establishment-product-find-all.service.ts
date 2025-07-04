import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentRepository } from '../../establishment/repositories/establishment.repository';
import { EstablishmentProductFindAllQueryDTO } from '../dtos/establishment-product-find-all-query.dto';
import { EstablishmentProductFindAllResponseDTO } from '../dtos/establishment-product-find-all-response.dto';
import { EstablishmentProductRepository } from '../repositories/establishment-product.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentProductFindAllService {
  private readonly logger = new Logger(EstablishmentProductFindAllService.name);

  constructor(
    private readonly establishmentProductRepository: EstablishmentProductRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
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

    const establishment = await this.establishmentRepository.findByIdAndUser(
      establishmentId,
      userId,
    );

    if (!establishment) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        {
          USER_ID: userId,
          ESTABLISHMENT_ID: establishmentId,
        },
      );

      this.logger.warn(errorMessage);

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

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
