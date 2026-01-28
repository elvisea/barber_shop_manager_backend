import { Injectable, Logger } from '@nestjs/common';

import { MemberProductCreateResponseDTO } from '../dtos/member-product-create-response.dto';
import { MemberProductUpdateParamDTO } from '../dtos/member-product-update-param.dto';
import { MemberProductUpdateRequestDTO } from '../dtos/member-product-update-request.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { MemberProductValidationService } from './member-product-validation.service';

/**
 * Service responsável por atualizar um MemberProduct.
 */
@Injectable()
export class MemberProductUpdateService {
  private readonly logger = new Logger(MemberProductUpdateService.name);

  constructor(
    private readonly memberProductRepository: MemberProductRepository,
    private readonly memberProductValidationService: MemberProductValidationService,
  ) {}

  /**
   * Atualiza um MemberProduct existente.
   *
   * @param dto - Dados para atualização (price, commission)
   * @param params - Parâmetros da rota (memberId, establishmentId, productId)
   * @param requesterId - ID do usuário que está fazendo a requisição
   * @returns DTO com os dados atualizados do MemberProduct
   * @throws CustomHttpException se alguma validação falhar
   */
  async execute(
    dto: MemberProductUpdateRequestDTO,
    params: MemberProductUpdateParamDTO,
    requesterId: string,
  ): Promise<MemberProductCreateResponseDTO> {
    this.logger.log(
      `Updating member product for member ${params.memberId} in establishment ${params.establishmentId} and product ${params.productId}`,
    );

    // Validações centralizadas em uma única chamada
    const memberProductWithRelations =
      await this.memberProductValidationService.execute(
        params.memberId,
        params.establishmentId,
        params.productId,
        requesterId,
      );

    // Atualiza o MemberProduct
    const updatedMemberProduct =
      await this.memberProductRepository.updateMemberProduct(
        memberProductWithRelations.id,
        {
          price: dto.price,
          commission: dto.commission,
        },
      );

    this.logger.log(
      `MemberProduct updated with ID: ${updatedMemberProduct.id}`,
    );

    return {
      id: updatedMemberProduct.id,
      memberId: updatedMemberProduct.userId,
      establishmentId: updatedMemberProduct.establishmentId,
      productId: updatedMemberProduct.productId,
      price: updatedMemberProduct.price,
      commission: Number(updatedMemberProduct.commission),
      createdAt: updatedMemberProduct.createdAt,
      updatedAt: updatedMemberProduct.updatedAt,
    };
  }
}
