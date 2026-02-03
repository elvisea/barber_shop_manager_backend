import { Injectable, Logger } from '@nestjs/common';

import { MemberProductFindOneParamDTO } from '../dtos/member-product-find-one-param.dto';
import { MemberProductFindOneResponseDTO } from '../dtos/member-product-find-one-response.dto';

import { MemberProductValidationService } from './member-product-validation.service';

import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Fetches a single member-product by member and product. Requester must be establishment owner.
 * Resolves the need to display or edit one product assignment (price, commission) for a member.
 */
@Injectable()
export class MemberProductFindOneService {
  private readonly logger = new Logger(MemberProductFindOneService.name);

  constructor(
    private readonly memberProductValidationService: MemberProductValidationService,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Returns the member-product with full details (product name, description, price, commission).
   *
   * @param params - Route params (memberId, productId)
   * @param requesterId - ID of the user performing the request (must be establishment owner)
   * @returns {@link MemberProductFindOneResponseDTO} with member-product data
   * @throws CustomHttpException when validation fails (not found, not owner, etc.)
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
