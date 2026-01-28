import { Injectable, Logger } from '@nestjs/common';

import { EstablishmentCustomerFindAllQueryDTO } from '../dtos/establishment-customer-find-all-query.dto';
import { EstablishmentCustomerFindAllResponseDTO } from '../dtos/establishment-customer-find-all-response.dto';
import { EstablishmentCustomerRepository } from '../repositories/establishment-customer.repository';

import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

@Injectable()
export class EstablishmentCustomerFindAllService {
  private readonly logger = new Logger(
    EstablishmentCustomerFindAllService.name,
  );

  constructor(
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
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

    // Validar acesso via UserEstablishment (permite owner ou membro ativo)
    await this.userEstablishmentValidationService.validateUserAccessToEstablishment(
      userId,
      establishmentId,
    );

    const { data, total } =
      await this.establishmentCustomerRepository.findAllByEstablishmentPaginated(
        {
          establishmentId,
          skip,
          take: limit,
        },
      );

    return new EstablishmentCustomerFindAllResponseDTO(
      data.map((customer) => ({
        ...customer,
        email: customer.email || undefined,
        phone: customer.phone || undefined,
      })),
      page,
      limit,
      total,
    );
  }
}
