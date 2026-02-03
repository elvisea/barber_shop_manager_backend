import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

const MAX_ITEMS = 5000;

/**
 * Lists members (id, name) of an establishment that the user can access.
 * Intended for feeding selects/combos in the "me" context (e.g. choice of barber or staff).
 * Resolves the need to show only members of the current establishment with access validated.
 */
@Injectable()
export class MeMembersService {
  private readonly logger = new Logger(MeMembersService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
  ) {}

  /**
   * Returns members of the establishment as id/name, sorted by name.
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
      `Listing members for user ${userId}, establishment ${establishmentId}`,
    );

    await this.establishmentAccessService.assertUserCanAccessEstablishment(
      userId,
      establishmentId,
    );

    const { data } =
      await this.userEstablishmentRepository.findAllByEstablishmentPaginated({
        establishmentId,
        skip: 0,
        take: MAX_ITEMS,
      });

    return data
      .map((ue) => ({ id: ue.user.id, name: ue.user.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
