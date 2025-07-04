import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentRepository } from '../../establishment/repositories/establishment.repository';
import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';
import { EstablishmentProductRepository } from '../repositories/establishment-product.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentProductFindByIdService {
  private readonly logger = new Logger(
    EstablishmentProductFindByIdService.name,
  );

  constructor(
    private readonly establishmentProductRepository: EstablishmentProductRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    productId: string,
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentProductCreateResponseDTO> {
    this.logger.log(
      `Finding product ${productId} for establishment ${establishmentId} by user ${userId}`,
    );

    // Validar se o usuário é owner/admin do estabelecimento
    const establishment = await this.establishmentRepository.findByIdAndUser(
      establishmentId,
      userId,
    );
    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: userId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    const product =
      await this.establishmentProductRepository.findByIdAndEstablishment(
        productId,
        establishmentId,
      );

    if (!product) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND,
        { PRODUCT_ID: productId, ESTABLISHMENT_ID: establishmentId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND,
      );
    }

    return {
      ...product,
      commission: Number(product.commission),
      description: product.description || undefined,
    };
  }
}
