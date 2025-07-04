import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentRepository } from '../../establishment/repositories/establishment.repository';
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
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    productId: string,
    establishmentId: string,
    userId: string,
    dto: EstablishmentProductUpdateRequestDTO,
  ): Promise<EstablishmentProductCreateResponseDTO> {
    this.logger.log(
      `Updating product ${productId} for establishment ${establishmentId} by user ${userId}`,
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

    // Verificar se o produto existe
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

    // Verificar duplicidade de nome (se for alterar o nome)
    if (dto.name && dto.name !== product.name) {
      const alreadyExists =
        await this.establishmentProductRepository.existsByName(
          establishmentId,
          dto.name,
        );
      if (alreadyExists) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS,
          { ESTABLISHMENT_ID: establishmentId, NAME: dto.name },
        );
        this.logger.warn(message);
        throw new CustomHttpException(
          message,
          HttpStatus.CONFLICT,
          ErrorCode.ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS,
        );
      }
    }

    const updated =
      await this.establishmentProductRepository.updateByIdAndEstablishment(
        productId,
        establishmentId,
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
