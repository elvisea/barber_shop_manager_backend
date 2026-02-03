import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { EstablishmentCustomerRepository } from '@/modules/establishment-customers/repositories/establishment-customer.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

const MAX_ITEMS = 5000;

/**
 * Lists customers (id, name) of an establishment that the user can access.
 * Intended for feeding selects/combos in the "me" context (e.g. choice of customer in forms).
 * Resolves the need to show only customers of the current establishment with access validated.
 */
@Injectable()
export class MeCustomersService {
  private readonly logger = new Logger(MeCustomersService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
  ) {}

  /**
   * Returns customers of the establishment as id/name, sorted by name.
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
      `Listing customers for user ${userId}, establishment ${establishmentId}`,
    );

    await this.establishmentAccessService.assertUserCanAccessEstablishment(
      userId,
      establishmentId,
    );

    const { data } =
      await this.establishmentCustomerRepository.findAllByEstablishmentPaginated(
        {
          establishmentId,
          skip: 0,
          take: MAX_ITEMS,
        },
      );

    return data
      .map((c) => ({ id: c.id, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
