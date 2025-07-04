import { Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';

import { EstablishmentResponseDTO } from '../dtos/establishment-response.dto';
import { EstablishmentUpdateRequestDTO } from '../dtos/establishment-update-request.dto';
import { EstablishmentRepository } from '../repositories/establishment.repository';

import { EstablishmentMembershipService } from './establishment-membership.service';

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
    private readonly establishmentMembershipService: EstablishmentMembershipService,
  ) {}

  async execute(
    establishmentId: string,
    userId: string,
    dto: EstablishmentUpdateRequestDTO,
  ): Promise<EstablishmentResponseDTO> {
    this.logger.log(
      `Updating establishment ${establishmentId} by user ${userId}`,
    );

    // Valida associação e role ADMIN
    await this.establishmentMembershipService.validateMembership(
      establishmentId,
      userId,
      [Role.ADMIN],
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
