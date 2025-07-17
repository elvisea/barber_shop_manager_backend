import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CustomHttpException } from '../../../common/exceptions/custom-http-exception';
import { ErrorCode } from '../../../enums/error-code';
import { ErrorMessageService } from '../../../error-message/error-message.service';
import { PlanCreateResponseDTO } from '../dtos/plan-create-response.dto';
import { PlanUpdateRequestDTO } from '../dtos/plan-update-request.dto';
import { PlanRepository } from '../repositories/plan.repository';

@Injectable()
export class PlanUpdateService {
  private readonly logger = new Logger(PlanUpdateService.name);

  constructor(
    private readonly planRepository: PlanRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    id: string,
    dto: PlanUpdateRequestDTO,
  ): Promise<PlanCreateResponseDTO> {
    this.logger.log(`Updating plan with id: ${id}`);

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

    const updated = await this.planRepository.update(id, dto);

    this.logger.log(`Plan updated: ${id}`);

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      price: updated.price,
      duration: updated.duration,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
