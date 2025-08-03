import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceFindAllParamDTO } from '../dtos/member-service-find-all-param.dto';
import { MemberServiceFindAllResponseDTO } from '../dtos/member-service-find-all-response.dto';
import { MemberServiceMapper } from '../mappers/member-service.mapper';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { EstablishmentOwnerAccessService } from '@/shared/establishment-owner-access/establishment-owner-access.service';

@Injectable()
export class MemberServiceFindAllService {
  private readonly logger = new Logger(MemberServiceFindAllService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
  ) {}

  async execute(
    params: MemberServiceFindAllParamDTO,
    query: BasePaginationQueryDTO,
    requesterId: string,
  ): Promise<MemberServiceFindAllResponseDTO> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Listing member services for member ${params.memberId} in establishment ${params.establishmentId}`,
    );

    await this.establishmentOwnerAccessService.assertOwnerHasAccess(
      params.establishmentId,
      requesterId,
    );

    const { data, total } =
      await this.memberServiceRepository.findAllByMemberPaginated({
        establishmentId: params.establishmentId,
        userId: params.memberId,
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
