import { Injectable, Logger } from '@nestjs/common';

import { EstablishmentMemberFindAllQueryDTO } from '../dtos/establishment-member-find-all-query.dto';
import { EstablishmentMemberFindAllResponseDTO } from '../dtos/establishment-member-find-all-response.dto';
import { EstablishmentMemberRepository } from '../repositories/establishment-member.repository';

import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class EstablishmentMemberFindAllService {
  private readonly logger = new Logger(EstablishmentMemberFindAllService.name);

  constructor(
    private readonly establishmentMemberRepository: EstablishmentMemberRepository,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) {}

  async execute(
    query: EstablishmentMemberFindAllQueryDTO,
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentMemberFindAllResponseDTO> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Finding all members for establishment ${establishmentId} by user ${userId} with page ${page}, limit ${limit}`,
    );

    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      userId,
    );

    const { data, total } =
      await this.establishmentMemberRepository.findAllByEstablishmentPaginated({
        establishmentId,
        skip,
        take: limit,
      });

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((member) => ({
        userId: member.userId,
        name: member.user.name,
        email: member.user.email,
        phone: member.user.phone,
        role: member.role,
        isActive: member.isActive,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      })),
      meta: {
        page,
        limit,
        total: {
          items: total,
          pages: totalPages,
        },
      },
    };
  }
}
