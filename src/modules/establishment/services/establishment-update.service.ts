import { Injectable, Logger } from '@nestjs/common';

import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';
import { EstablishmentUpdateRequestDTO } from '../dtos/establishment-update-request.dto';
import { EstablishmentRepository } from '../repositories/establishment.repository';

import { EstablishmentOwnerAccessService } from '@/modules/establishment/services/establishment-owner-access.service';

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
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
  ) {}

  async execute(
    establishmentId: string,
    userId: string,
    dto: EstablishmentUpdateRequestDTO,
  ): Promise<EstablishmentFindOneResponseDTO> {
    this.logger.log(
      `Updating establishment ${establishmentId} by user ${userId}`,
    );

    await this.establishmentOwnerAccessService.assertOwnerHasAccess(
      establishmentId,
      userId,
    );

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
