import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CustomHttpException } from '../../../common/exceptions/custom-http-exception';
import { ErrorCode } from '../../../enums/error-code';
import { ErrorMessageService } from '../../../error-message/error-message.service';
import { EstablishmentMemberRepository } from '../../establishment-members/repositories/establishment-member.repository';
import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';
import { EstablishmentUpdateRequestDTO } from '../dtos/establishment-update-request.dto';
import { EstablishmentRepository } from '../repositories/establishment.repository';

/**
 * Service responsible for updating an establishment.
 *
 * - Receives the member object already validated and attached by the EstablishmentMemberGuard.
 * - Avoids redundant queries for membership validation.
 * - Throws if the member or establishment is not found (should not happen if guard is used).
 */
@Injectable()
export class EstablishmentUpdateService {
  private readonly logger = new Logger(EstablishmentUpdateService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly establishmentMemberRepository: EstablishmentMemberRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    establishmentId: string,
    userId: string,
    dto: EstablishmentUpdateRequestDTO,
  ): Promise<EstablishmentFindOneResponseDTO> {
    this.logger.log(
      `Updating establishment ${establishmentId} by user ${userId}`,
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
      `Establishment ${establishmentId} found for user ${userId}. Proceeding with update.`,
    );

    const updated = await this.establishmentRepository.update(
      establishmentId,
      dto,
    );

    this.logger.log(`Establishment ${establishmentId} updated successfully.`);

    return {
      id: updated.id,
      name: updated.name,
      address: updated.address,
      phone: updated.phone,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
