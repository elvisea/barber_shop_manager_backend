import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';
import { EstablishmentCustomerUpdateRequestDTO } from '../dtos/establishment-customer-update-request.dto';
import { EstablishmentCustomerRepository } from '../repositories/establishment-customer.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentOwnerAccessService } from '@/modules/establishment/services/establishment-owner-access.service';

@Injectable()
export class EstablishmentCustomerUpdateService {
  private readonly logger = new Logger(EstablishmentCustomerUpdateService.name);

  constructor(
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    customerId: string,
    establishmentId: string,
    userId: string,
    dto: EstablishmentCustomerUpdateRequestDTO,
  ): Promise<EstablishmentCustomerCreateResponseDTO> {
    this.logger.log(
      `Updating customer ${customerId} for establishment ${establishmentId} by user ${userId}`,
    );

    await this.establishmentOwnerAccessService.assertOwnerHasAccess(
      establishmentId,
      userId,
    );

    const customer =
      await this.establishmentCustomerRepository.findByIdAndEstablishment(
        customerId,
        establishmentId,
      );

    if (!customer) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND,
        { CUSTOMER_ID: customerId, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND,
      );
    }

    // Validar duplicidade de email/phone se alterados
    if (dto.email && dto.email !== customer.email) {
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

    if (dto.phone && dto.phone !== customer.phone) {
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

    const updated =
      await this.establishmentCustomerRepository.updateByIdAndEstablishment(
        customerId,
        establishmentId,
        dto,
      );

    this.logger.log(`Customer ${customerId} updated successfully.`);

    return {
      ...updated,
      email: updated.email || undefined,
      phone: updated.phone || undefined,
    };
  }
}
