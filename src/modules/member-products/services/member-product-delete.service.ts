import { Injectable, Logger } from '@nestjs/common';

import { MemberProductDeleteParamDTO } from '../dtos/member-product-delete-param.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { MemberProductValidationService } from './member-product-validation.service';

/**
 * Service responsável por deletar um MemberProduct.
 */
@Injectable()
export class MemberProductDeleteService {
  private readonly logger = new Logger(MemberProductDeleteService.name);

  constructor(
    private readonly memberProductRepository: MemberProductRepository,
    private readonly memberProductValidationService: MemberProductValidationService,
  ) {}

  /**
   * Deleta um MemberProduct existente (soft delete).
   *
   * @param params - Parâmetros da rota (memberId, establishmentId, productId)
   * @param requesterId - ID do usuário que está fazendo a requisição
   * @throws CustomHttpException se alguma validação falhar
   */
  async execute(
    params: MemberProductDeleteParamDTO,
    requesterId: string,
  ): Promise<void> {
    this.logger.log(
      `Deleting member product for member ${params.memberId} in establishment ${params.establishmentId} and product ${params.productId}`,
    );

    // Validações centralizadas em uma única chamada
    const memberProductWithRelations =
      await this.memberProductValidationService.execute(
        params.memberId,
        params.establishmentId,
        params.productId,
        requesterId,
      );

    // Faz soft delete do MemberProduct
    await this.memberProductRepository.deleteMemberProduct(
      memberProductWithRelations.id,
      requesterId,
    );

    this.logger.log(
      `MemberProduct deleted with ID: ${memberProductWithRelations.id}`,
    );
  }
}
