import { Injectable, Logger } from '@nestjs/common';

import {
  AppointmentCreateBusinessRuleContext,
  IAppointmentCreateBusinessRule,
} from '../contracts/appointment-create-business-rule.interface';
import { AppointmentAccessValidationService } from '../services/appointment-access-validation.service';

/**
 * One of the extensible appointment-create business rules.
 * Single responsibility: selected services must be allowed for the member in the establishment.
 * When member-services exists, the implementation can be updated here without changing the create flow.
 */
@Injectable()
export class ValidateMemberServicesRule implements IAppointmentCreateBusinessRule {
  private readonly logger = new Logger(ValidateMemberServicesRule.name);

  constructor(
    private readonly appointmentAccessValidationService: AppointmentAccessValidationService,
  ) {}

  async validate(context: AppointmentCreateBusinessRuleContext): Promise<void> {
    this.logger.log(
      `Validating member services: userId=${context.userId}, establishmentId=${context.establishmentId}, serviceIds=[${context.serviceIds.join(', ')}]`,
    );
    await this.appointmentAccessValidationService.validateUserAllowedServices(
      context.establishmentId,
      context.userId,
      context.serviceIds,
    );
  }
}
