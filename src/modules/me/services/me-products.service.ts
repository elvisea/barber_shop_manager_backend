import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { MeEstablishmentAccessService } from './me-establishment-access.service';

import { EstablishmentProductRepository } from '@/modules/establishment-products/repositories/establishment-product.repository';

const MAX_ITEMS = 5000;

@Injectable()
export class MeProductsService {
  private readonly logger = new Logger(MeProductsService.name);

  constructor(
    private readonly meEstablishmentAccessService: MeEstablishmentAccessService,
    private readonly establishmentProductRepository: EstablishmentProductRepository,
  ) {}

  async execute(
    userId: string,
    establishmentId: string,
  ): Promise<MeIdNameDto[]> {
    this.logger.log(
      `Listing products for user ${userId}, establishment ${establishmentId}`,
    );

    await this.meEstablishmentAccessService.assertUserHasAccessToEstablishment(
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
