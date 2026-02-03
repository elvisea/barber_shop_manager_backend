import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceFindAllParamDTO } from '../dtos/member-service-find-all-param.dto';
import { MemberServiceFindAllResponseDTO } from '../dtos/member-service-find-all-response.dto';
import { MemberServiceMapper } from '../mappers/member-service.mapper';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Lista serviços associados a um membro em um estabelecimento, com paginação.
 * O requester deve ser o dono do estabelecimento. Resolve a necessidade de mostrar quais serviços
 * (e seu preço, duração, comissão) estão atribuídos a um determinado membro.
 */
@Injectable()
export class MemberServiceFindAllService {
  private readonly logger = new Logger(MemberServiceFindAllService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Retorna uma lista paginada de member-services para o membro informado.
   *
   * @param params - Parâmetros da rota (memberId)
   * @param query - Paginação (page, limit)
   * @param requesterId - ID do usuário que faz a requisição (deve ser dono do estabelecimento)
   * @returns {@link MemberServiceFindAllResponseDTO} paginado
   * @throws CustomHttpException quando o requester não é dono ou o membro não pertence ao estabelecimento
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
