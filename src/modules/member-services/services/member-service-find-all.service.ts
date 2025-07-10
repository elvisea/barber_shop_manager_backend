import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceFindAllResponseDTO } from '../dtos/member-service-find-all-response.dto';
import { MemberServiceMapper } from '../mappers/member-service.mapper';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class MemberServiceFindAllService {
  private readonly logger = new Logger(MemberServiceFindAllService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) {}

  async execute(
    establishmentId: string,
    memberId: string,
    requesterId: string,
    query: BasePaginationQueryDTO,
  ): Promise<MemberServiceFindAllResponseDTO> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Listing member services for member ${memberId} in establishment ${establishmentId}`,
    );

    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      requesterId,
      false, // permite ADMIN ou o próprio membro
    );

    const { data, total } =
      await this.memberServiceRepository.findAllByMemberPaginated({
        establishmentId,
        userId: memberId,
        skip,
        take: limit,
      });

    return {
      data: data.map(MemberServiceMapper.toFindAllResponse),
      meta: {
        page,
        limit,
        total: {
          items: total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }
}
