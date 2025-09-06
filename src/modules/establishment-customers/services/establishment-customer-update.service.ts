import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentCustomerUpdateRequestDTO } from '../dtos/establishment-customer-update-request.dto';
import { EstablishmentCustomerUpdateResponseDTO } from '../dtos/establishment-customer-update-response.dto';
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
  ): Promise<EstablishmentCustomerUpdateResponseDTO> {
    this.logger.log(
      `Updating customer ${customerId} for establishment ${establishmentId} by user ${userId}`,
    );
    this.logger.log(`Received update data: ${JSON.stringify(dto)}`);

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
      const existingCustomer =
        await this.establishmentCustomerRepository.findByEmailAndEstablishment(
          establishmentId,
          dto.email,
        );

      if (existingCustomer && existingCustomer.id !== customerId) {
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
      const existingCustomer =
        await this.establishmentCustomerRepository.findByPhoneAndEstablishment(
          establishmentId,
          dto.phone,
        );

      if (existingCustomer && existingCustomer.id !== customerId) {
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

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: Partial<{
      name: string;
      email?: string | null;
      phone?: string | null;
    }> = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.email !== undefined)
      updateData.email = dto.email === '' ? null : dto.email;
    if (dto.phone !== undefined)
      updateData.phone = dto.phone === '' ? null : dto.phone;

    this.logger.log(
      `Updating customer with data: ${JSON.stringify(updateData)}`,
    );

    const updated =
      await this.establishmentCustomerRepository.updateByIdAndEstablishment(
        customerId,
        establishmentId,
        updateData,
      );

    this.logger.log(
      `Customer ${customerId} updated successfully. Data: ${JSON.stringify(updated)}`,
    );

    return updated;
  }
}
