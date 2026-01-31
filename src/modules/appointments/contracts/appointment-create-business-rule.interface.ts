/**
 * Common context passed to all appointment-create business rules (establishmentId, userId, serviceIds).
 */
export interface AppointmentCreateBusinessRuleContext {
  establishmentId: string;
  userId: string;
  serviceIds: string[];
}

/**
 * Contract for extensible appointment-create business rules.
 * New rules are new classes implementing this interface; they validate domain constraints
 * and do not mix permission/access logic with business logic.
 */
export interface IAppointmentCreateBusinessRule {
  /**
   * Validates the rule. Throws if the rule is violated.
   */
  validate(context: AppointmentCreateBusinessRuleContext): Promise<void>;
}
