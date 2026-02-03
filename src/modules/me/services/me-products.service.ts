import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { EstablishmentProductRepository } from '@/modules/establishment-products/repositories/establishment-product.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

const MAX_ITEMS = 5000;

/**
 * Lists products (id, name) of an establishment that the user can access.
 * Intended for feeding selects/combos in the "me" context (e.g. choice of product in forms).
 * Resolves the need to show only products of the current establishment with access validated.
 */
@Injectable()
export class MeProductsService {
  private readonly logger = new Logger(MeProductsService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly establishmentProductRepository: EstablishmentProductRepository,
  ) {}

  /**
   * Returns products of the establishment as id/name, sorted by name.
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
      `Listing products for user ${userId}, establishment ${establishmentId}`,
    );

    await this.establishmentAccessService.assertUserCanAccessEstablishment(
      userId,
      establishmentId,
    );

    const { data } =
      await this.establishmentProductRepository.findAllByEstablishmentPaginated(
        {
          establishmentId,
          skip: 0,
          take: MAX_ITEMS,
        },
      );

    return data
      .map((p) => ({ id: p.id, name: p.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
