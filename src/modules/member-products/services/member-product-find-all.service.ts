import { Injectable, Logger } from '@nestjs/common';

import { MemberProductFindAllParamDTO } from '../dtos/member-product-find-all-param.dto';
import { MemberProductFindAllResponseDTO } from '../dtos/member-product-find-all-response.dto';
import { MemberProductMapper } from '../mappers/member-product.mapper';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Lists products associated with a member in an establishment, with pagination.
 * The requester must be the establishment owner. Resolves the need to show which products
 * (and their price/commission) are assigned to a given member.
 */
@Injectable()
export class MemberProductFindAllService {
  private readonly logger = new Logger(MemberProductFindAllService.name);

  constructor(
    private readonly memberProductRepository: MemberProductRepository,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Returns a paginated list of member-products for the given member.
   *
   * @param params - Route params (memberId)
   * @param query - Pagination (page, limit)
   * @param requesterId - ID of the user performing the request (must be establishment owner)
   * @returns Paginated {@link MemberProductFindAllResponseDTO}
   * @throws CustomHttpException when requester is not owner or member does not belong to establishment
   */
  async execute(
    params: MemberProductFindAllParamDTO,
    query: BasePaginationQueryDTO,
    requesterId: string,
  ): Promise<MemberProductFindAllResponseDTO> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // 1. Obtém establishmentId (valida que o requester é dono e que o member pertence ao estabelecimento)
    const establishmentId =
      await this.userEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember(
        params.memberId,
        requesterId,
      );

    this.logger.log(
      `Listing member products for member ${params.memberId} in establishment ${establishmentId}`,
    );

    // 2. Busca MemberProducts do membro paginados
    const { data, total } =
      await this.memberProductRepository.findAllByMemberPaginated({
        establishmentId,
        memberId: params.memberId,
        skip,
        take: limit,
      });

    this.logger.log(
      `Found ${total} member products for member ${params.memberId} in establishment ${establishmentId}`,
    );

    // 3. Retorna o DTO de resposta paginado
    return new MemberProductFindAllResponseDTO(
      data.map((item) => MemberProductMapper.toFindAllResponse(item)),
      page,
      limit,
      total,
    );
  }
}
