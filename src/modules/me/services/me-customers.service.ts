import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { MeEstablishmentAccessService } from './me-establishment-access.service';

import { EstablishmentCustomerRepository } from '@/modules/establishment-customers/repositories/establishment-customer.repository';

const MAX_ITEMS = 5000;

@Injectable()
export class MeCustomersService {
  private readonly logger = new Logger(MeCustomersService.name);

  constructor(
    private readonly meEstablishmentAccessService: MeEstablishmentAccessService,
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
  ) {}

  async execute(
    userId: string,
    establishmentId: string,
  ): Promise<MeIdNameDto[]> {
    this.logger.log(
      `Listing customers for user ${userId}, establishment ${establishmentId}`,
    );

    await this.meEstablishmentAccessService.assertUserHasAccessToEstablishment(
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
