import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberProductCreateParamDTO } from '../dtos/member-product-create-param.dto';
import { MemberProductCreateRequestDTO } from '../dtos/member-product-create-request.dto';
import { MemberProductCreateResponseDTO } from '../dtos/member-product-create-response.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentProductRepository } from '@/modules/establishment-products/repositories/establishment-product.repository';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Associates an establishment product with a member, defining price and commission for that member.
 * Only the establishment owner can create this association. If a soft-deleted record exists for
 * the same member/product/establishment, it is restored instead of creating a new one.
 * Resolves the need to assign products to staff with custom pricing and commission per member.
 */
@Injectable()
export class MemberProductCreateService {
  private readonly logger = new Logger(MemberProductCreateService.name);

  constructor(
    private readonly memberProductRepository: MemberProductRepository,
    private readonly establishmentProductRepository: EstablishmentProductRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Creates or restores a member-product association.
   *
   * @param dto - Price and commission for the member-product
   * @param params - Route params (memberId, productId)
   * @param requesterId - ID of the user performing the request (must be establishment owner)
   * @returns The created or restored member-product as {@link MemberProductCreateResponseDTO}
   * @throws CustomHttpException NOT_FOUND when product does not exist or owner/member validation fails
   * @throws CustomHttpException CONFLICT when an active association already exists
   */
  async execute(
    dto: MemberProductCreateRequestDTO,
    params: MemberProductCreateParamDTO,
    requesterId: string,
  ): Promise<MemberProductCreateResponseDTO> {
    // 1. Busca o produto do estabelecimento
    const product =
      await this.establishmentProductRepository.findByIdWithEstablishment(
        params.productId,
      );

    if (!product) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND,
        { PRODUCT_ID: params.productId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND,
      );
    }

    // 2. Obtém establishmentId do produto
    const establishmentId = product.establishmentId;

    // 3. Valida que o requester é dono do estabelecimento e que o member pertence a ele (apenas dono pode atribuir)
    await this.userEstablishmentValidationService.validateUserAndEstablishment(
      params.memberId,
      establishmentId,
      requesterId,
    );

    this.logger.log(
      `Creating member product for member ${params.memberId} in establishment ${establishmentId} and product ${params.productId}`,
    );

    // 4. Verifica se já existe associação ativa desse produto para o membro
    const alreadyExists =
      await this.memberProductRepository.existsByMemberEstablishmentProduct(
        params.memberId,
        establishmentId,
        params.productId,
      );

    if (alreadyExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_PRODUCT_ALREADY_EXISTS,
        {
          MEMBER_ID: params.memberId,
          ESTABLISHMENT_ID: establishmentId,
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

    // 5. Verifica se existir registro soft-deleted com a mesma tripla (para restaurar em vez de criar)
    const softDeleted =
      await this.memberProductRepository.findOneByMemberEstablishmentProductIncludingDeleted(
        params.memberId,
        establishmentId,
        params.productId,
      );

    // 6. Cria o MemberProduct ou restaura o registro soft-deleted
    const memberProduct = softDeleted?.deletedAt
      ? await this.memberProductRepository.restoreMemberProduct(
          softDeleted.id,
          { price: dto.price, commission: dto.commission },
        )
      : await this.memberProductRepository.createMemberProduct({
          memberId: params.memberId,
          establishmentId,
          productId: params.productId,
          price: dto.price,
          commission: dto.commission,
        });

    this.logger.log(
      `MemberProduct ${softDeleted?.deletedAt ? 'restored' : 'created'} with ID: ${memberProduct.id}`,
    );

    // 7. Retorna o DTO de resposta
    return {
      id: memberProduct.id,
      memberId: memberProduct.userId,
      establishmentId: memberProduct.establishmentId,
      productId: memberProduct.productId,
      price: memberProduct.price,
      commission: Number(memberProduct.commission),
      createdAt: memberProduct.createdAt,
      updatedAt: memberProduct.updatedAt,
    };
  }
}
