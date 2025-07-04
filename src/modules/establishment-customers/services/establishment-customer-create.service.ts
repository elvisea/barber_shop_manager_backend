import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentRepository } from '../../establishment/repositories/establishment.repository';
import { EstablishmentCustomerCreateRequestDTO } from '../dtos/establishment-customer-create-request.dto';
import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';
import { EstablishmentCustomerRepository } from '../repositories/establishment-customer.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentCustomerCreateService {
  private readonly logger = new Logger(EstablishmentCustomerCreateService.name);

  constructor(
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    dto: EstablishmentCustomerCreateRequestDTO,
    userId: string,
  ): Promise<EstablishmentCustomerCreateResponseDTO> {
    this.logger.log(
      `Creating customer '${dto.name}' for establishment ${dto.establishmentId} by user ${userId}`,
    );

    // Validar se o usuário é owner/admin do estabelecimento
    const establishment = await this.establishmentRepository.findByIdAndUser(
      dto.establishmentId,
      userId,
    );
    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { ESTABLISHMENT_ID: dto.establishmentId, USER_ID: userId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    // Verificar duplicidade de email/telefone
    if (dto.email) {
      const exists = await this.establishmentCustomerRepository.existsByEmail(
        dto.establishmentId,
        dto.email,
      );
      if (exists) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.ESTABLISHMENT_CUSTOMER_EMAIL_ALREADY_EXISTS,
          { ESTABLISHMENT_ID: dto.establishmentId, EMAIL: dto.email },
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
        dto.establishmentId,
        dto.phone,
      );
      if (exists) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS,
          { ESTABLISHMENT_ID: dto.establishmentId, PHONE: dto.phone },
        );

        this.logger.warn(message);

        throw new CustomHttpException(
          message,
          HttpStatus.CONFLICT,
          ErrorCode.ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS,
        );
      }
    }

    const customer =
      await this.establishmentCustomerRepository.createCustomer(dto);

    this.logger.log(`Customer created with ID: ${customer.id}`);

    return customer;
  }
}
