import { Injectable, Logger } from '@nestjs/common';

import { EstablishmentRepository } from '../repositories/establishment.repository';

import { EstablishmentOwnerAccessService } from '@/modules/establishment/services/establishment-owner-access.service';

@Injectable()
export class EstablishmentDeleteService {
  private readonly logger = new Logger(EstablishmentDeleteService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
  ) {}

  async execute(establishmentId: string, userId: string): Promise<void> {
    this.logger.log(
      `Deleting establishment ${establishmentId} by user ${userId}`,
    );

    await this.establishmentOwnerAccessService.assertOwnerHasAccess(
      establishmentId,
      userId,
    );

    await this.establishmentRepository.deleteByIdAndUser(
      establishmentId,
      userId,
    );

    this.logger.log(`Establishment ${establishmentId} deleted successfully.`);
  }
}
