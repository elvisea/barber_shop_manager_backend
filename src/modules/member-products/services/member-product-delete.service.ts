import { Injectable, Logger } from '@nestjs/common';

import { MemberProductDeleteParamDTO } from '../dtos/member-product-delete-param.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { MemberProductValidationService } from './member-product-validation.service';

import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Faz soft delete de uma associação member-product. Apenas o dono do estabelecimento pode deletar.
 * Resolve a necessidade de remover a atribuição de um produto a um membro sem perder o histórico.
 */
@Injectable()
export class MemberProductDeleteService {
  private readonly logger = new Logger(MemberProductDeleteService.name);

  constructor(
    private readonly memberProductRepository: MemberProductRepository,
    private readonly memberProductValidationService: MemberProductValidationService,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Faz soft delete do member-product. Não faz nada se já estiver deletado.
   *
   * @param params - Parâmetros da rota (memberId, productId)
   * @param requesterId - ID do usuário que faz a requisição (deve ser dono do estabelecimento)
   * @throws CustomHttpException quando a validação falha (não encontrado, não é dono, etc.)
   */
  async execute(
    params: MemberProductDeleteParamDTO,
    requesterId: string,
  ): Promise<void> {
    // 1. Obtém establishmentId (valida que o requester é dono e que o member pertence ao estabelecimento)
    const establishmentId =
      await this.userEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember(
        params.memberId,
        requesterId,
      );

    this.logger.log(
      `Deleting member product for member ${params.memberId} in establishment ${establishmentId} and product ${params.productId}`,
    );

    // 2. Valida e busca o MemberProduct existente com relacionamentos
    const memberProductWithRelations =
      await this.memberProductValidationService.execute(
        params.memberId,
        establishmentId,
        params.productId,
        requesterId,
      );

    // 3. Faz soft delete do MemberProduct
    await this.memberProductRepository.deleteMemberProduct(
      memberProductWithRelations.id,
      requesterId,
    );

    this.logger.log(
      `MemberProduct deleted with ID: ${memberProductWithRelations.id}`,
    );
  }
}
