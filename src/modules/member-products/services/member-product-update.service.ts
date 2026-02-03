import { Injectable, Logger } from '@nestjs/common';

import { MemberProductCreateResponseDTO } from '../dtos/member-product-create-response.dto';
import { MemberProductUpdateParamDTO } from '../dtos/member-product-update-param.dto';
import { MemberProductUpdateRequestDTO } from '../dtos/member-product-update-request.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { MemberProductValidationService } from './member-product-validation.service';

import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Atualiza preço e comissão de um member-product existente. Apenas o dono do estabelecimento pode atualizar.
 * Resolve a necessidade de alterar preço e comissão do produto por membro sem remover a associação.
 */
@Injectable()
export class MemberProductUpdateService {
  private readonly logger = new Logger(MemberProductUpdateService.name);

  constructor(
    private readonly memberProductRepository: MemberProductRepository,
    private readonly memberProductValidationService: MemberProductValidationService,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Atualiza o member-product com novo preço e comissão.
   *
   * @param dto - Novo preço e comissão
   * @param params - Parâmetros da rota (memberId, productId)
   * @param requesterId - ID do usuário que faz a requisição (deve ser dono do estabelecimento)
   * @returns Member-product atualizado como {@link MemberProductCreateResponseDTO}
   * @throws CustomHttpException quando a validação falha (não encontrado, não é dono, etc.)
   */
  async execute(
    dto: MemberProductUpdateRequestDTO,
    params: MemberProductUpdateParamDTO,
    requesterId: string,
  ): Promise<MemberProductCreateResponseDTO> {
    // 1. Obtém establishmentId (valida que o requester é dono e que o member pertence ao estabelecimento)
    const establishmentId =
      await this.userEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember(
        params.memberId,
        requesterId,
      );

    this.logger.log(
      `Updating member product for member ${params.memberId} in establishment ${establishmentId} and product ${params.productId}`,
    );

    // 2. Valida e busca o MemberProduct existente com relacionamentos
    const memberProductWithRelations =
      await this.memberProductValidationService.execute(
        params.memberId,
        establishmentId,
        params.productId,
        requesterId,
      );

    // 3. Atualiza o MemberProduct
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

    // 4. Retorna o DTO de resposta
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
