import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberProductCreateParamDTO } from '../dtos/member-product-create-param.dto';
import { MemberProductCreateRequestDTO } from '../dtos/member-product-create-request.dto';
import { MemberProductCreateResponseDTO } from '../dtos/member-product-create-response.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentProductRepository } from '@/modules/establishment-products/repositories/establishment-product.repository';
import { MemberRepository } from '@/modules/members/repositories/member.repository';
import { EstablishmentOwnerAccessService } from '@/shared/establishment-owner-access/establishment-owner-access.service';

@Injectable()
export class MemberProductCreateService {
  private readonly logger = new Logger(MemberProductCreateService.name);

  constructor(
    private readonly memberProductRepository: MemberProductRepository,
    private readonly memberRepository: MemberRepository,
    private readonly establishmentProductRepository: EstablishmentProductRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
  ) {}

  async execute(
    dto: MemberProductCreateRequestDTO,
    params: MemberProductCreateParamDTO,
    requesterId: string,
  ): Promise<MemberProductCreateResponseDTO> {
    this.logger.log(
      `Creating member product for member ${params.memberId} in establishment ${params.establishmentId} and product ${params.productId}`,
    );

    // 1. Verifica se o requester é dono do estabelecimento
    await this.establishmentOwnerAccessService.assertOwnerHasAccess(
      params.establishmentId,
      requesterId,
    );

    // 2. Verifica se o membro existe no estabelecimento
    const member = await this.memberRepository.findByEstablishmentAndId(
      params.establishmentId,
      params.memberId,
    );

    if (!member) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        {
          MEMBER_ID: params.memberId,
          ESTABLISHMENT_ID: params.establishmentId,
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_NOT_FOUND,
      );
    }

    // 3. Verifica se o produto existe no estabelecimento
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
