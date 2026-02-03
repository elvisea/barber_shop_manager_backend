import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

const MAX_ESTABLISHMENTS = 500;

/**
 * Lists establishments where the user is owner or member.
 * Intended for the "me" context so the user can choose which establishment to work with.
 * Resolves the need to show a single list of all establishments the user can access.
 */
@Injectable()
export class MeEstablishmentsService {
  private readonly logger = new Logger(MeEstablishmentsService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
  ) {}

  /**
   * Returns establishments (id, name) the user owns or is a member of, merged and sorted by name.
   *
   * @param userId - ID of the user
   * @returns List of {@link MeIdNameDto} sorted by name, without duplicates
   */
  async execute(userId: string): Promise<MeIdNameDto[]> {
    this.logger.log(`Listing establishments for user ${userId}`);

    const [ownedResult, userEstablishments] = await Promise.all([
      this.establishmentRepository.findAllByUserPaginated({
        userId,
        skip: 0,
        take: MAX_ESTABLISHMENTS,
      }),
      this.userEstablishmentRepository.findAllByUserWithRelations(userId),
    ]);

    const byId = new Map<string, MeIdNameDto>();

    for (const e of ownedResult.data) {
      byId.set(e.id, { id: e.id, name: e.name });
    }
    for (const ue of userEstablishments) {
      if (!byId.has(ue.establishment.id)) {
        byId.set(ue.establishment.id, {
          id: ue.establishment.id,
          name: ue.establishment.name,
        });
      }
    }

    const list = Array.from(byId.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    this.logger.log(`Found ${list.length} establishments for user ${userId}`);
    return list;
  }
}
