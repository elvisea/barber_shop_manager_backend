import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CustomHttpException } from '../../../common/exceptions/custom-http-exception';
import { ErrorCode } from '../../../enums/error-code';
import { ErrorMessageService } from '../../../error-message/error-message.service';
import { PlanRepository } from '../repositories/plan.repository';

@Injectable()
export class PlanDeleteService {
  private readonly logger = new Logger(PlanDeleteService.name);

  constructor(
    private readonly planRepository: PlanRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(`Deleting plan with id: ${id}`);

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

    await this.planRepository.delete(id);
    this.logger.log(`Plan deleted: ${id}`);
  }
}
