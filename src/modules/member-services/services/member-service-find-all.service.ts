import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberServiceFindAllParamDTO } from '../dtos/member-service-find-all-param.dto';
import { MemberServiceFindAllResponseDTO } from '../dtos/member-service-find-all-response.dto';
import { MemberServiceMapper } from '../mappers/member-service.mapper';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

@Injectable()
export class MemberServiceFindAllService {
  private readonly logger = new Logger(MemberServiceFindAllService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
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

    const establishment = await this.establishmentRepository.findById(
      params.establishmentId,
    );

    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: params.establishmentId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    if (establishment.ownerId !== requesterId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: params.establishmentId, USER_ID: requesterId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    const { data, total } =
      await this.memberServiceRepository.findAllByMemberPaginated({
        establishmentId: params.establishmentId,
        memberId: params.memberId,
        skip,
        take: limit,
      });

    return new MemberServiceFindAllResponseDTO(
      data.map(MemberServiceMapper.toFindAllResponse),
      page,
      limit,
      total,
    );
  }
}
