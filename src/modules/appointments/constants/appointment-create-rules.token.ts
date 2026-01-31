import type { IAppointmentCreateBusinessRule } from '../contracts/appointment-create-business-rule.interface';

/**
 * Injection token for the extensible list of appointment-create business rules.
 * To add a rule: create a class implementing IAppointmentCreateBusinessRule and register it
 * in the module provider (e.g. useFactory: (...rules) => rules, inject: [ValidateMemberServicesRule, NewRule]).
 */
export const APPOINTMENT_CREATE_BUSINESS_RULES =
  'APPOINTMENT_CREATE_BUSINESS_RULES';

/** Type of the list injected by APPOINTMENT_CREATE_BUSINESS_RULES. */
export type AppointmentCreateBusinessRulesToken =
  IAppointmentCreateBusinessRule[];
