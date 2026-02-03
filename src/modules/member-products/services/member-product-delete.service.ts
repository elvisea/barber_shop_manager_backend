import { Injectable, Logger } from '@nestjs/common';

import { MemberProductDeleteParamDTO } from '../dtos/member-product-delete-param.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { MemberProductValidationService } from './member-product-validation.service';

import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Soft-deletes a member-product association. Only the establishment owner can delete.
 * Resolves the need to remove a product assignment from a member without losing history.
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
   * Soft-deletes the member-product. No-op if already deleted.
   *
   * @param params - Route params (memberId, productId)
   * @param requesterId - ID of the user performing the request (must be establishment owner)
   * @throws CustomHttpException when validation fails (not found, not owner, etc.)
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
