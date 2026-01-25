import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentCustomerUpdateRequestDTO } from '../dtos/establishment-customer-update-request.dto';
import { EstablishmentCustomerUpdateResponseDTO } from '../dtos/establishment-customer-update-response.dto';
import { EstablishmentCustomerRepository } from '../repositories/establishment-customer.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentCustomerUpdateService {
  private readonly logger = new Logger(EstablishmentCustomerUpdateService.name);

  constructor(
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    customerId: string,
    userId: string,
    dto: EstablishmentCustomerUpdateRequestDTO,
  ): Promise<EstablishmentCustomerUpdateResponseDTO> {
    this.logger.log(`Updating customer ${customerId} by user ${userId}`);
    this.logger.log(`Received update data: ${JSON.stringify(dto)}`);

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

    // Validar duplicidade de email/phone se alterados
    if (dto.email && dto.email !== customer.email) {
      const existingCustomer =
        await this.establishmentCustomerRepository.findByEmailAndEstablishment(
          customer.establishment.id,
          dto.email,
        );

      if (existingCustomer && existingCustomer.id !== customerId) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.ESTABLISHMENT_CUSTOMER_EMAIL_ALREADY_EXISTS,
          { ESTABLISHMENT_ID: customer.establishment.id, EMAIL: dto.email },
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
          customer.establishment.id,
          dto.phone,
        );

      if (existingCustomer && existingCustomer.id !== customerId) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS,
          { ESTABLISHMENT_ID: customer.establishment.id, PHONE: dto.phone },
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

    const updated = await this.establishmentCustomerRepository.updateById(
      customerId,
      updateData,
    );

    this.logger.log(
      `Customer ${customerId} updated successfully. Data: ${JSON.stringify(updated)}`,
    );

    return updated;
  }
}
