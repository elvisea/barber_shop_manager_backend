import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';

import { ErrorMessageService } from '../../../error-message/error-message.service';
import { EstablishmentServiceCreateRequestDTO } from '../dtos/establishment-service-create-request.dto';
import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceRepository } from '../repositories/establishment-service.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { EstablishmentMembershipService } from '@/modules/establishment/services/establishment-membership.service';

@Injectable()
export class EstablishmentServiceCreateService {
  private readonly logger = new Logger(EstablishmentServiceCreateService.name);

  constructor(
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly establishmentMembershipService: EstablishmentMembershipService,
  ) {}

  async execute(
    dto: EstablishmentServiceCreateRequestDTO,
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentServiceCreateResponseDTO> {
    this.logger.log(
      `Creating service "${dto.name}" for establishment ${establishmentId} by user ${userId}`,
    );

    // Validar se o usuário é membro do estabelecimento e tem permissão ADMIN
    await this.establishmentMembershipService.validateMembership(
      establishmentId,
      userId,
      [Role.ADMIN],
    );

    // Verificar se já existe serviço com o mesmo nome no estabelecimento
    const alreadyExists =
      await this.establishmentServiceRepository.existsByName(
        establishmentId,
        dto.name,
      );

    if (alreadyExists) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS,
        { ESTABLISHMENT_ID: establishmentId, NAME: dto.name },
      );

      this.logger.warn(errorMessage);

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.CONFLICT,
        ErrorCode.ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS,
      );
    }

    const service = await this.establishmentServiceRepository.createService(
      dto,
      establishmentId,
    );

    this.logger.log(`Service created with ID: ${service.id}`);

    const convertedCommission = Number(service.commission);

    return {
      ...service,
      commission: convertedCommission,
    };
  }
}
