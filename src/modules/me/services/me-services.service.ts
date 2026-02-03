import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

const MAX_ITEMS = 5000;

/**
 * Lists services (id, name) of an establishment that the user can access.
 * Intended for feeding selects/combos in the "me" context (e.g. choice of service in forms).
 * Resolves the need to show only services of the current establishment with access validated.
 */
@Injectable()
export class MeServicesService {
  private readonly logger = new Logger(MeServicesService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
  ) {}

  /**
   * Returns services of the establishment as id/name, sorted by name.
   *
   * @param userId - ID of the user performing the request
   * @param establishmentId - ID of the establishment
   * @returns List of {@link MeIdNameDto} sorted by name
   * @throws CustomHttpException when user has no access to the establishment
   */
  async execute(
    userId: string,
    establishmentId: string,
  ): Promise<MeIdNameDto[]> {
    this.logger.log(
      `Listing services for user ${userId}, establishment ${establishmentId}`,
    );

    await this.establishmentAccessService.assertUserCanAccessEstablishment(
      userId,
      establishmentId,
    );

    const { data } =
      await this.establishmentServiceRepository.findAllByEstablishmentPaginated(
        {
          establishmentId,
          skip: 0,
          take: MAX_ITEMS,
        },
      );

    return data
      .map((s) => ({ id: s.id, name: s.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
