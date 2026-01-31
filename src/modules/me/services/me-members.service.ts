import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

const MAX_ITEMS = 5000;

@Injectable()
export class MeMembersService {
  private readonly logger = new Logger(MeMembersService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
  ) {}

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
