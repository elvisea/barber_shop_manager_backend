import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CustomHttpException } from '../../../common/exceptions/custom-http-exception';
import { ErrorCode } from '../../../enums/error-code';
import { ErrorMessageService } from '../../../error-message/error-message.service';
import { PlanCreateResponseDTO } from '../dtos/plan-create-response.dto';
import { PlanRepository } from '../repositories/plan.repository';

@Injectable()
export class PlanFindByIdService {
  private readonly logger = new Logger(PlanFindByIdService.name);

  constructor(
    private readonly planRepository: PlanRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(id: string): Promise<PlanCreateResponseDTO> {
    this.logger.log(`Finding plan by id: ${id}`);

    const plan = await this.planRepository.findById(id);

    if (!plan) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.PLAN_NOT_FOUND,
        { PLAN_ID: id },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.PLAN_NOT_FOUND,
      );
    }

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
