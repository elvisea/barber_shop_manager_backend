import { Injectable, Logger } from '@nestjs/common';

import { EstablishmentRepository } from '../repositories/establishment.repository';

import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class EstablishmentDeleteService {
  private readonly logger = new Logger(EstablishmentDeleteService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) {}

  async execute(establishmentId: string, userId: string): Promise<void> {
    this.logger.log(
      `Deleting establishment ${establishmentId} by user ${userId}`,
    );

    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      userId,
    );

    await this.establishmentRepository.deleteByIdAndUser(establishmentId);

    this.logger.log(`Establishment ${establishmentId} deleted successfully.`);
  }
}
