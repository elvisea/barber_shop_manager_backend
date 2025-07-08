import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentCustomerCreateRequestDTO } from '../dtos/establishment-customer-create-request.dto';
import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';
import { EstablishmentCustomerRepository } from '../repositories/establishment-customer.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class EstablishmentCustomerCreateService {
  private readonly logger = new Logger(EstablishmentCustomerCreateService.name);

  constructor(
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    dto: Omit<EstablishmentCustomerCreateRequestDTO, 'establishmentId'>,
    userId: string,
    establishmentId: string,
  ): Promise<EstablishmentCustomerCreateResponseDTO> {
    this.logger.log(
      `Creating customer '${dto.name}' for establishment ${establishmentId} by user ${userId}`,
    );

    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      userId,
    );

    // Verificar duplicidade de email/telefone
    if (dto.email) {
      const exists = await this.establishmentCustomerRepository.existsByEmail(
        establishmentId,
        dto.email,
      );
      if (exists) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.ESTABLISHMENT_CUSTOMER_EMAIL_ALREADY_EXISTS,
          { ESTABLISHMENT_ID: establishmentId, EMAIL: dto.email },
        );

        this.logger.warn(message);

        throw new CustomHttpException(
          message,
          HttpStatus.CONFLICT,
          ErrorCode.ESTABLISHMENT_CUSTOMER_EMAIL_ALREADY_EXISTS,
        );
      }
    }

    if (dto.phone) {
      const exists = await this.establishmentCustomerRepository.existsByPhone(
        establishmentId,
        dto.phone,
      );
      if (exists) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS,
          { ESTABLISHMENT_ID: establishmentId, PHONE: dto.phone },
        );

        this.logger.warn(message);

        throw new CustomHttpException(
          message,
          HttpStatus.CONFLICT,
          ErrorCode.ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS,
        );
      }
    }

    const customer = await this.establishmentCustomerRepository.createCustomer(
      dto,
      establishmentId,
    );

    this.logger.log(`Customer created with ID: ${customer.id}`);

    return customer;
  }
}
