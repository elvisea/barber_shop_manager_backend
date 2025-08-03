import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentProductCreateRequestDTO } from '../dtos/establishment-product-create-request.dto';
import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';
import { EstablishmentProductRepository } from '../repositories/establishment-product.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentOwnerAccessService } from '@/modules/establishment/services/establishment-owner-access.service';

@Injectable()
export class EstablishmentProductCreateService {
  private readonly logger = new Logger(EstablishmentProductCreateService.name);

  constructor(
    private readonly establishmentProductRepository: EstablishmentProductRepository,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    dto: EstablishmentProductCreateRequestDTO,
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentProductCreateResponseDTO> {
    this.logger.log(
      `Creating product "${dto.name}" for establishment ${establishmentId} by user ${userId}`,
    );

    await this.establishmentOwnerAccessService.assertOwnerHasAccess(
      establishmentId,
      userId,
    );

    // Verificar duplicidade de nome
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

    const product = await this.establishmentProductRepository.createProduct(
      dto,
      establishmentId,
    );

    this.logger.log(`Product created with ID: ${product.id}`);

    return {
      ...product,
      commission: Number(product.commission),
      description: product.description || undefined,
    };
  }
}
