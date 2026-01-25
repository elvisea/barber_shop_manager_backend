import { HttpStatus, Injectable, Logger } from '@nestjs/common';

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
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    productId: string,
    userId: string,
  ): Promise<EstablishmentProductCreateResponseDTO> {
    this.logger.log(`Finding product ${productId} by user ${userId}`);

    const product =
      await this.establishmentProductRepository.findByIdWithEstablishment(
        productId,
      );

    if (!product) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND,
        { PRODUCT_ID: productId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND,
      );
    }

    if (product.establishment.ownerId !== userId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: product.establishment.id, USER_ID: userId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    return {
      ...product,
      commission: Number(product.commission),
      description: product.description || undefined,
    };
  }
}
