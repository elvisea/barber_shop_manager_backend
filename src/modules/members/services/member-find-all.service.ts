import { Injectable, Logger } from '@nestjs/common';

import { MemberFindAllQueryDTO, MemberPaginatedResponseDTO } from '../dtos';
import { MemberMapper } from '../mappers';
import { MemberRepository } from '../repositories/member.repository';

import { EstablishmentOwnerAccessService } from '@/modules/establishment/services/establishment-owner-access.service';

@Injectable()
export class MemberFindAllService {
  private readonly logger = new Logger(MemberFindAllService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
  ) {}

  async execute(
    establishmentId: string,
    requesterId: string,
    query: MemberFindAllQueryDTO,
  ): Promise<MemberPaginatedResponseDTO> {
    this.logger.log(
      `Finding all members for establishment ${establishmentId} by user ${requesterId}`,
    );

    // 1. Verifica se o estabelecimento existe e o usuário é o dono
    await this.establishmentOwnerAccessService.assertOwnerHasAccess(
      establishmentId,
      requesterId,
    );

    // 2. Calcula paginação
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // 3. Busca membros paginados
    const { data, total } =
      await this.memberRepository.findAllByEstablishmentPaginated({
        establishmentId,
        skip,
        take: limit,
      });

    // 4. Mapeia dados para resposta
    const members = MemberMapper.toResponseDTOArray(data, false);

    this.logger.log(`Found ${members.length} members out of ${total} total`);

    // 5. Retorna resposta paginada com metadados calculados automaticamente
    return new MemberPaginatedResponseDTO(members, page, limit, total);
  }
}
