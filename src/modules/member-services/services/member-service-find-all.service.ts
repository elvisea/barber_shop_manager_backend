import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceFindAllParamDTO } from '../dtos/member-service-find-all-param.dto';
import { MemberServiceFindAllResponseDTO } from '../dtos/member-service-find-all-response.dto';
import { MemberServiceMapper } from '../mappers/member-service.mapper';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Lists services associated with a member in an establishment, with pagination.
 * The requester must be the establishment owner. Resolves the need to show which services
 * (and their price, duration, commission) are assigned to a given member.
 */
@Injectable()
export class MemberServiceFindAllService {
  private readonly logger = new Logger(MemberServiceFindAllService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Returns a paginated list of member-services for the given member.
   *
   * @param params - Route params (memberId)
   * @param query - Pagination (page, limit)
   * @param requesterId - ID of the user performing the request (must be establishment owner)
   * @returns Paginated {@link MemberServiceFindAllResponseDTO}
   * @throws CustomHttpException when requester is not owner or member does not belong to establishment
   */
  async execute(
    params: MemberServiceFindAllParamDTO,
    query: BasePaginationQueryDTO,
    requesterId: string,
  ): Promise<MemberServiceFindAllResponseDTO> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // 1. Obtém establishmentId (valida que o requester é dono e que o member pertence ao estabelecimento)
    const establishmentId =
      await this.userEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember(
        params.memberId,
        requesterId,
      );

    this.logger.log(
      `Listing member services for member ${params.memberId} in establishment ${establishmentId}`,
    );

    // 2. Busca MemberServices do membro paginados
    const { data, total } =
      await this.memberServiceRepository.findAllByMemberPaginated({
        establishmentId,
        memberId: params.memberId,
        skip,
        take: limit,
      });

    this.logger.log(
      `Found ${total} member services for member ${params.memberId} in establishment ${establishmentId}`,
    );

    // 3. Retorna o DTO de resposta paginado
    return new MemberServiceFindAllResponseDTO(
      data.map((item) => MemberServiceMapper.toFindAllResponse(item)),
      page,
      limit,
      total,
    );
  }
}
