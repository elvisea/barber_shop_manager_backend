import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';
import { EstablishmentProductRepository } from '../repositories/establishment-product.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class EstablishmentProductFindByIdService {
  private readonly logger = new Logger(
    EstablishmentProductFindByIdService.name,
  );

  constructor(
    private readonly establishmentProductRepository: EstablishmentProductRepository,
    private readonly establishmentAccessService: EstablishmentAccessService,
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

    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      userId,
    );

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
