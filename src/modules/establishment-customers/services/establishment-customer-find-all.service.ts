import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentRepository } from '../../establishment/repositories/establishment.repository';
import { EstablishmentCustomerFindAllQueryDTO } from '../dtos/establishment-customer-find-all-query.dto';
import { EstablishmentCustomerFindAllResponseDTO } from '../dtos/establishment-customer-find-all-response.dto';
import { EstablishmentCustomerRepository } from '../repositories/establishment-customer.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentCustomerFindAllService {
  private readonly logger = new Logger(
    EstablishmentCustomerFindAllService.name,
  );

  constructor(
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    query: EstablishmentCustomerFindAllQueryDTO,
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentCustomerFindAllResponseDTO> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Finding all customers for establishment ${establishmentId} by user ${userId} with page ${page}, limit ${limit}`,
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
      await this.establishmentCustomerRepository.findAllByEstablishmentPaginated(
        {
          establishmentId,
          skip,
          take: limit,
        },
      );

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((customer) => ({
        ...customer,
        email: customer.email || undefined,
        phone: customer.phone || undefined,
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
