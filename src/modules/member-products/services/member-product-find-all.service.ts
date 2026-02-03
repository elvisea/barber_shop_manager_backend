import { Injectable, Logger } from '@nestjs/common';

import { MemberProductFindAllParamDTO } from '../dtos/member-product-find-all-param.dto';
import { MemberProductFindAllResponseDTO } from '../dtos/member-product-find-all-response.dto';
import { MemberProductMapper } from '../mappers/member-product.mapper';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Lista produtos associados a um membro em um estabelecimento, com paginação.
 * O requester deve ser o dono do estabelecimento. Resolve a necessidade de mostrar quais produtos
 * (e seu preço/comissão) estão atribuídos a um determinado membro.
 */
@Injectable()
export class MemberProductFindAllService {
  private readonly logger = new Logger(MemberProductFindAllService.name);

  constructor(
    private readonly memberProductRepository: MemberProductRepository,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Retorna uma lista paginada de member-products para o membro informado.
   *
   * @param params - Parâmetros da rota (memberId)
   * @param query - Paginação (page, limit)
   * @param requesterId - ID do usuário que faz a requisição (deve ser dono do estabelecimento)
   * @returns {@link MemberProductFindAllResponseDTO} paginado
   * @throws CustomHttpException quando o requester não é dono ou o membro não pertence ao estabelecimento
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
