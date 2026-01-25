import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { SubscriptionCreateRequestDTO } from '../dtos/subscription-create-request.dto';
import { SubscriptionCreateResponseDTO } from '../dtos/subscription-create-response.dto';
import { SubscriptionCreateDTO } from '../dtos/subscription-create.dto';
import { SubscriptionRepository } from '../repositories/subscription.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

@Injectable()
export class SubscriptionCreateService {
  private readonly logger = new Logger(SubscriptionCreateService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    dto: SubscriptionCreateRequestDTO,
    establishmentId: string,
    userId: string,
  ): Promise<SubscriptionCreateResponseDTO> {
    const establishment =
      await this.establishmentRepository.findById(establishmentId);

    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    if (establishment.ownerId !== userId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: userId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

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
