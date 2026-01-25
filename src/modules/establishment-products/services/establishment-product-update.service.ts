import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';
import { EstablishmentProductUpdateRequestDTO } from '../dtos/establishment-product-update-request.dto';
import { EstablishmentProductRepository } from '../repositories/establishment-product.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentProductUpdateService {
  private readonly logger = new Logger(EstablishmentProductUpdateService.name);

  constructor(
    private readonly establishmentProductRepository: EstablishmentProductRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    productId: string,
    userId: string,
    dto: EstablishmentProductUpdateRequestDTO,
  ): Promise<EstablishmentProductCreateResponseDTO> {
    this.logger.log(`Updating product ${productId} by user ${userId}`);

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

    // Verificar duplicidade de nome (se for alterar o nome)
    if (dto.name && dto.name !== product.name) {
      const alreadyExists =
        await this.establishmentProductRepository.existsByName(
          product.establishment.id,
          dto.name,
        );
      if (alreadyExists) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS,
          { ESTABLISHMENT_ID: product.establishment.id, NAME: dto.name },
        );
        this.logger.warn(message);
        throw new CustomHttpException(
          message,
          HttpStatus.CONFLICT,
          ErrorCode.ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS,
        );
      }
    }

    const updated = await this.establishmentProductRepository.updateById(
      productId,
      dto,
    );

    this.logger.log(`Product ${productId} updated successfully.`);

    return {
      ...updated,
      commission: Number(updated.commission),
      description: updated.description || undefined,
    };
  }
}
