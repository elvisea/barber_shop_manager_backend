import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberProductCreateParamDTO } from '../dtos/member-product-create-param.dto';
import { MemberProductCreateRequestDTO } from '../dtos/member-product-create-request.dto';
import { MemberProductCreateResponseDTO } from '../dtos/member-product-create-response.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentProductRepository } from '@/modules/establishment-products/repositories/establishment-product.repository';
import { MemberEstablishmentValidationService } from '@/modules/members/services/member-establishment-validation.service';

@Injectable()
export class MemberProductCreateService {
  private readonly logger = new Logger(MemberProductCreateService.name);

  constructor(
    private readonly memberProductRepository: MemberProductRepository,
    private readonly establishmentProductRepository: EstablishmentProductRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly memberEstablishmentValidationService: MemberEstablishmentValidationService,
  ) {}

  async execute(
    dto: MemberProductCreateRequestDTO,
    params: MemberProductCreateParamDTO,
    requesterId: string,
  ): Promise<MemberProductCreateResponseDTO> {
    this.logger.log(
      `Creating member product for member ${params.memberId} in establishment ${params.establishmentId} and product ${params.productId}`,
    );

    // Validações de Establishment e Member centralizadas
    await this.memberEstablishmentValidationService.execute(
      params.memberId,
      params.establishmentId,
      requesterId,
    );

    // Verifica se o produto existe no estabelecimento
    const product =
      await this.establishmentProductRepository.findByIdAndEstablishment(
        params.productId,
        params.establishmentId,
      );

    if (!product) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND,
        {
          PRODUCT_ID: params.productId,
          ESTABLISHMENT_ID: params.establishmentId,
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND,
      );
    }

    // 4. Verifica se já existe associação desse produto para o membro
    const alreadyExists =
      await this.memberProductRepository.existsByMemberEstablishmentProduct(
        params.memberId,
        params.establishmentId,
        params.productId,
      );

    if (alreadyExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_PRODUCT_ALREADY_EXISTS,
        {
          MEMBER_ID: params.memberId,
          ESTABLISHMENT_ID: params.establishmentId,
          PRODUCT_ID: params.productId,
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.MEMBER_PRODUCT_ALREADY_EXISTS,
      );
    }

    // 5. Cria o MemberProduct
    const memberProduct =
      await this.memberProductRepository.createMemberProduct({
        memberId: params.memberId,
        establishmentId: params.establishmentId,
        productId: params.productId,
        price: dto.price,
        commission: dto.commission,
      });

    this.logger.log(`MemberProduct created with ID: ${memberProduct.id}`);

    return {
      id: memberProduct.id,
      memberId: memberProduct.memberId,
      establishmentId: memberProduct.establishmentId,
      productId: memberProduct.productId,
      price: memberProduct.price,
      commission: Number(memberProduct.commission),
      createdAt: memberProduct.createdAt,
      updatedAt: memberProduct.updatedAt,
    };
  }
}
