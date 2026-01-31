import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';
import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';

const MAX_ITEMS = 5000;

@Injectable()
export class MeServicesService {
  private readonly logger = new Logger(MeServicesService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
  ) {}

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
