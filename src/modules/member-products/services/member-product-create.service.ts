import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentMemberRepository } from '../../establishment-members/repositories/establishment-member.repository';
import { MemberProductCreateRequestDTO } from '../dtos/member-product-create-request.dto';
import { MemberProductCreateResponseDTO } from '../dtos/member-product-create-response.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentProductRepository } from '@/modules/establishment-products/repositories/establishment-product.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class MemberProductCreateService {
  private readonly logger = new Logger(MemberProductCreateService.name);

  constructor(
    private readonly memberProductRepository: MemberProductRepository,
    private readonly establishmentMemberRepository: EstablishmentMemberRepository,
    private readonly establishmentProductRepository: EstablishmentProductRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) {}

  async execute(
    dto: MemberProductCreateRequestDTO,
    establishmentId: string,
    memberId: string,
    requesterId: string,
  ): Promise<MemberProductCreateResponseDTO> {
    this.logger.log(
      `Creating member product for member ${memberId} in establishment ${establishmentId} and product ${dto.productId}`,
    );

    // 1. Verifica se o requester tem acesso ao estabelecimento
    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      requesterId,
    );

    // 2. Verifica se o membro existe no estabelecimento
    const memberExists =
      await this.establishmentMemberRepository.existsByUserAndEstablishment(
        memberId,
        establishmentId,
      );

    if (!memberExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND,
        { USER_ID: memberId, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND,
      );
    }

    // 3. Verifica se o produto existe no estabelecimento
    const product =
      await this.establishmentProductRepository.findByIdAndEstablishment(
        dto.productId,
        establishmentId,
      );

    if (!product) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND,
        { PRODUCT_ID: dto.productId, ESTABLISHMENT_ID: establishmentId },
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
      await this.memberProductRepository.existsByUserEstablishmentProduct(
        memberId,
        establishmentId,
        dto.productId,
      );
    if (alreadyExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_PRODUCT_ALREADY_EXISTS,
        {
          USER_ID: memberId,
          ESTABLISHMENT_ID: establishmentId,
          PRODUCT_ID: dto.productId,
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
        userId: memberId,
        establishmentId,
        productId: dto.productId,
        price: dto.price,
        commission: dto.commission,
      });

    this.logger.log(`MemberProduct created with ID: ${memberProduct.id}`);

    return {
      id: memberProduct.id,
      userId: memberProduct.userId,
      establishmentId: memberProduct.establishmentId,
      productId: memberProduct.productId,
      price: memberProduct.price,
      commission: Number(memberProduct.commission),
      createdAt: memberProduct.createdAt,
      updatedAt: memberProduct.updatedAt,
    };
  }
}
