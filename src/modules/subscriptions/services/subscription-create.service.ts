import { Injectable, Logger } from '@nestjs/common';

import { SubscriptionCreateRequestDTO } from '../dtos/subscription-create-request.dto';
import { SubscriptionCreateResponseDTO } from '../dtos/subscription-create-response.dto';
import { SubscriptionCreateDTO } from '../dtos/subscription-create.dto';
import { SubscriptionRepository } from '../repositories/subscription.repository';

import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class SubscriptionCreateService {
  private readonly logger = new Logger(SubscriptionCreateService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(
    dto: SubscriptionCreateRequestDTO,
    establishmentId: string,
    userId: string,
  ): Promise<SubscriptionCreateResponseDTO> {
    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      userId,
    );

    const data: SubscriptionCreateDTO = {
      establishmentId,
      planId: dto.planId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      paid: dto.paid ?? false,
      phone: dto.phone,
    };

    const subscription = await this.subscriptionRepository.create(data);

    this.logger.log(`Subscription created with id: ${subscription.id}`);

    return {
      id: subscription.id,
      establishmentId: subscription.establishmentId,
      planId: subscription.planId,
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate.toISOString(),
      paid: subscription.paid,
      phone: subscription.phone,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
    };
  }
}
