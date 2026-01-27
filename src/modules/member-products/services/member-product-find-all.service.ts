import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberProductFindAllParamDTO } from '../dtos/member-product-find-all-param.dto';
import { MemberProductFindAllResponseDTO } from '../dtos/member-product-find-all-response.dto';
import { MemberProductMapper } from '../mappers/member-product.mapper';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

@Injectable()
export class MemberProductFindAllService {
  private readonly logger = new Logger(MemberProductFindAllService.name);

  constructor(
    private readonly memberProductRepository: MemberProductRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    params: MemberProductFindAllParamDTO,
    query: BasePaginationQueryDTO,
    requesterId: string,
  ): Promise<MemberProductFindAllResponseDTO> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Listing member products for member ${params.memberId} in establishment ${params.establishmentId}`,
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
      await this.memberProductRepository.findAllByMemberPaginated({
        establishmentId: params.establishmentId,
        memberId: params.memberId,
        skip,
        take: limit,
      });

    this.logger.log(
      `Found ${total} member products for member ${params.memberId}`,
    );

    return new MemberProductFindAllResponseDTO(
      data.map(MemberProductMapper.toFindAllResponse),
      page,
      limit,
      total,
    );
  }
}
