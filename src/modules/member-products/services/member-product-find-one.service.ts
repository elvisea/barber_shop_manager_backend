import { Injectable, Logger } from '@nestjs/common';

import { MemberProductFindOneParamDTO } from '../dtos/member-product-find-one-param.dto';
import { MemberProductFindOneResponseDTO } from '../dtos/member-product-find-one-response.dto';

import { MemberProductValidationService } from './member-product-validation.service';

import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Busca um member-product por membro e produto. O requester deve ser o dono do estabelecimento.
 * Resolve a necessidade de exibir ou editar uma atribuição de produto (preço, comissão) para um membro.
 */
@Injectable()
export class MemberProductFindOneService {
  private readonly logger = new Logger(MemberProductFindOneService.name);

  constructor(
    private readonly memberProductValidationService: MemberProductValidationService,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Retorna o member-product com todos os detalhes (nome do produto, descrição, preço, comissão).
   *
   * @param params - Parâmetros da rota (memberId, productId)
   * @param requesterId - ID do usuário que faz a requisição (deve ser dono do estabelecimento)
   * @returns {@link MemberProductFindOneResponseDTO} com os dados do member-product
   * @throws CustomHttpException quando a validação falha (não encontrado, não é dono, etc.)
   */
  async execute(
    params: MemberProductFindOneParamDTO,
    requesterId: string,
  ): Promise<MemberProductFindOneResponseDTO> {
    // 1. Obtém establishmentId (valida que o requester é dono e que o member pertence ao estabelecimento)
    const establishmentId =
      await this.userEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember(
        params.memberId,
        requesterId,
      );

    this.logger.log(
      `Finding member product for member ${params.memberId} in establishment ${establishmentId} and product ${params.productId}`,
    );

    // 2. Valida e busca o MemberProduct existente com relacionamentos
    const memberProductWithRelations =
      await this.memberProductValidationService.execute(
        params.memberId,
        establishmentId,
        params.productId,
        requesterId,
      );

    this.logger.log(`MemberProduct found: ${memberProductWithRelations.id}`);

    // 3. Retorna o DTO de resposta
    return {
      id: memberProductWithRelations.product.id, // Retorna productId para consistência com find-all
      name: memberProductWithRelations.product.name,
      description: memberProductWithRelations.product.description,
      price: memberProductWithRelations.price,
      commission: Number(memberProductWithRelations.commission),
      createdAt: memberProductWithRelations.createdAt,
      updatedAt: memberProductWithRelations.updatedAt,
    };
  }
}
