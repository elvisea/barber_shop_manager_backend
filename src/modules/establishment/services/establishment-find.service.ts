import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';

import { EstablishmentPaginatedResponse } from '../dtos/establishment-paginated-response.dto';
import { EstablishmentQueryRequestDTO } from '../dtos/establishment-query-request.dto';
import { EstablishmentResponseDTO } from '../dtos/establishment-response.dto';
import { EstablishmentRepository } from '../repositories/establishment.repository';

import { EstablishmentMembershipService } from './establishment-membership.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentFindService {
  private readonly logger = new Logger(EstablishmentFindService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentMembershipService: EstablishmentMembershipService,
  ) {}

  async execute(
    query: EstablishmentQueryRequestDTO,
    userId: string,
  ): Promise<EstablishmentPaginatedResponse | EstablishmentResponseDTO> {
    if (query.establishmentId) {
      return this.findById(query.establishmentId, userId);
    }

    return this.findAll(query, userId);
  }

  private async findById(
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentResponseDTO> {
    this.logger.log(
      `Finding establishment with ID ${establishmentId} for userId=${userId}`,
    );

    const memberWithEstablishment =
      await this.establishmentMembershipService.validateMembership(
        establishmentId,
        userId,
        [Role.ADMIN],
      );
    const establishment = memberWithEstablishment.establishment;

    if (!establishment) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        {
          USER_ID: userId,
          ESTABLISHMENT_ID: establishmentId,
        },
      );

      this.logger.warn(errorMessage);

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    return {
      id: establishment.id,
      name: establishment.name,
      address: establishment.address,
      phone: establishment.phone,
      createdAt: establishment.createdAt,
      updatedAt: establishment.updatedAt,
    };
  }

  private async findAll(
    query: EstablishmentQueryRequestDTO,
    userId: string,
  ): Promise<EstablishmentPaginatedResponse> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Finding all establishments for userId=${userId} with page ${page}, limit ${limit}`,
    );

    const { data, total } =
      await this.establishmentRepository.findAllByUserPaginated({
        userId,
        skip,
        take: limit,
      });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
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
