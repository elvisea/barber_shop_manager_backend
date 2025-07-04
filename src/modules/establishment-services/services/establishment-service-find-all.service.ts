import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CustomHttpException } from '../../../common/exceptions/custom-http-exception';
import { ErrorCode } from '../../../enums/error-code';
import { ErrorMessageService } from '../../../error-message/error-message.service';
import { EstablishmentMemberRepository } from '../../establishment-members/repositories/establishment-member.repository';
import { EstablishmentServiceFindAllQueryDTO } from '../dtos/establishment-service-find-all-query.dto';
import { EstablishmentServiceFindAllResponseDTO } from '../dtos/establishment-service-find-all-response.dto';
import { EstablishmentServiceRepository } from '../repositories/establishment-service.repository';

@Injectable()
export class EstablishmentServiceFindAllService {
  private readonly logger = new Logger(EstablishmentServiceFindAllService.name);

  constructor(
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly establishmentMemberRepository: EstablishmentMemberRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    query: EstablishmentServiceFindAllQueryDTO,
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentServiceFindAllResponseDTO> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Finding all services for establishment ${establishmentId} by user ${userId} with page ${page}, limit ${limit}`,
    );

    // Validar se o usuário é membro do estabelecimento e tem permissão ADMIN
    const establishmentMember =
      await this.establishmentMemberRepository.findEstablishmentByIdAndAdmin(
        establishmentId,
        userId,
      );

    if (!establishmentMember) {
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

    this.logger.log(
      `Establishment ${establishmentId} found for user ${userId}. Proceeding with service find all.`,
    );

    const { data, total } =
      await this.establishmentServiceRepository.findAllByEstablishmentPaginated(
        {
          establishmentId,
          skip,
          take: limit,
        },
      );

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        commission: Number(service.commission),
        establishmentId: service.establishmentId,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
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
