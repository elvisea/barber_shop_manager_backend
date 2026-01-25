import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentCustomerRepository } from '../repositories/establishment-customer.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentCustomerDeleteService {
  private readonly logger = new Logger(EstablishmentCustomerDeleteService.name);

  constructor(
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(customerId: string, userId: string): Promise<void> {
    this.logger.log(`Deleting customer ${customerId} by user ${userId}`);

    const customer =
      await this.establishmentCustomerRepository.findByIdWithEstablishment(
        customerId,
      );

    if (!customer) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND,
        { CUSTOMER_ID: customerId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND,
      );
    }

    if (customer.establishment.ownerId !== userId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: customer.establishment.id, USER_ID: userId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    await this.establishmentCustomerRepository.deleteById(customerId);

    this.logger.log(`Customer ${customerId} deleted successfully.`);
  }
}
