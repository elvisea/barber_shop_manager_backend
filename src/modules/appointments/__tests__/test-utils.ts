import { AppointmentStatus, UserRole } from '@prisma/client';

import type { AppointmentWithRelations } from '../types/appointment-with-relations.type';

import type { ErrorCode } from '@/enums/error-code';
import type { ErrorMessageService } from '@/error-message/error-message.service';
import type { EstablishmentAccessResult } from '@/shared/establishment-access/types/establishment-access-result.type';

/**
 * Default IDs for appointment tests. Use these to keep specs consistent.
 */
export const DEFAULT_ESTABLISHMENT_ID = 'est-123';
export const DEFAULT_APPOINTMENT_ID = 'apt-123';
export const DEFAULT_REQUESTER_ID = 'user-123';
export const DEFAULT_USER_ID_BARBER = 'user-barber';
export const DEFAULT_CUSTOMER_ID = 'cust-123';

/**
 * Creates a mock ErrorMessageService with getMessage as jest.fn().
 * Optional default implementation returns "Mock error message for ${errorCode}".
 */
export function createMockErrorMessageService(): jest.Mocked<
  Pick<ErrorMessageService, 'getMessage'>
> {
  return {
    getMessage: jest.fn((errorCode: ErrorCode) => {
      return `Mock error message for ${errorCode}`;
    }),
  };
}

/**
 * Base appointment shape for tests. Partial of AppointmentWithRelations so specs can override only what they need.
 */
export type MockAppointmentOverrides = Partial<
  Pick<
    AppointmentWithRelations,
    | 'id'
    | 'establishmentId'
    | 'customerId'
    | 'userId'
    | 'startTime'
    | 'endTime'
    | 'totalAmount'
    | 'totalDuration'
    | 'status'
    | 'notes'
    | 'customer'
    | 'user'
    | 'createdAt'
    | 'updatedAt'
    | 'services'
  >
>;

/**
 * Minimal appointment shape returned by createMockAppointment for use in specs.
 * Does not require full Prisma types for customer/user.
 */
export interface MockAppointmentResult {
  id: string;
  establishmentId: string;
  customerId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  totalDuration: number;
  status: string;
  notes: string | null;
  customer: { name: string };
  user: { name: string };
  createdAt: Date;
  updatedAt: Date;
  services?: AppointmentWithRelations['services'];
}

/**
 * Creates a mock appointment with default values. Merge overrides for test-specific data.
 */
export function createMockAppointment(
  overrides: MockAppointmentOverrides = {},
): MockAppointmentResult {
  const startTime = overrides.startTime ?? new Date('2025-02-01T10:00:00.000Z');
  const endTime = overrides.endTime ?? new Date('2025-02-01T11:00:00.000Z');

  return {
    id: DEFAULT_APPOINTMENT_ID,
    establishmentId: DEFAULT_ESTABLISHMENT_ID,
    customerId: DEFAULT_CUSTOMER_ID,
    customer: { name: 'Cliente' },
    userId: DEFAULT_USER_ID_BARBER,
    user: { name: 'Barbeiro' },
    startTime,
    endTime,
    totalAmount: 3000,
    totalDuration: 60,
    status: AppointmentStatus.PENDING,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export type MockEstablishmentAccessResultOverrides = Partial<{
  establishmentId: string;
  isOwner: boolean;
  userEstablishment: EstablishmentAccessResult['userEstablishment'];
}>;

/**
 * Creates a mock EstablishmentAccessResult. Supports owner and barber (userEstablishment) scenarios.
 */
export function createMockEstablishmentAccessResult(
  overrides: MockEstablishmentAccessResultOverrides = {},
): EstablishmentAccessResult {
  const establishmentId = overrides.establishmentId ?? DEFAULT_ESTABLISHMENT_ID;

  return {
    establishment: {
      id: establishmentId,
    } as EstablishmentAccessResult['establishment'],
    isOwner: overrides.isOwner ?? true,
    ...(overrides.userEstablishment && {
      userEstablishment: overrides.userEstablishment,
    }),
  };
}

/** @deprecated Use createMockEstablishmentAccessResult. Kept for backward compatibility in specs. */
export const createMockAppointmentAccessResult =
  createMockEstablishmentAccessResult;

/**
 * Creates a mock AppointmentRepository with all methods as jest.fn().
 * Each spec configures only the methods it uses.
 */
export function createMockAppointmentRepository(): {
  findById: jest.Mock;
  findAll: jest.Mock;
  count: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  findByEstablishmentId: jest.Mock;
  findByUserId: jest.Mock;
  findByCustomerId: jest.Mock;
  findConflictingAppointments: jest.Mock;
} {
  return {
    findById: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByEstablishmentId: jest.fn(),
    findByUserId: jest.fn(),
    findByCustomerId: jest.fn(),
    findConflictingAppointments: jest.fn(),
  };
}

/**
 * Creates a mock AppointmentAccessValidationService with all methods as jest.fn().
 */
export function createMockAppointmentAccessValidationService(): {
  validateCanCreate: jest.Mock;
  assertRequesterCanActForMember: jest.Mock;
  validateCustomer: jest.Mock;
  validateUser: jest.Mock;
  validateServices: jest.Mock;
  validateUserAllowedServices: jest.Mock;
} {
  return {
    validateCanCreate: jest.fn(),
    assertRequesterCanActForMember: jest.fn(),
    validateCustomer: jest.fn(),
    validateUser: jest.fn(),
    validateServices: jest.fn(),
    validateUserAllowedServices: jest.fn(),
  };
}

/**
 * Creates a mock AppointmentCreateBusinessRulesService with all methods as jest.fn().
 */
export function createMockAppointmentCreateBusinessRulesService(): {
  calculateTotalsAndEndTime: jest.Mock;
  validateNoTimeConflict: jest.Mock;
  validateTimeRange: jest.Mock;
} {
  return {
    calculateTotalsAndEndTime: jest.fn(),
    validateNoTimeConflict: jest.fn(),
    validateTimeRange: jest.fn(),
  };
}

/**
 * Creates a mock AppointmentUpdateBusinessRulesService with resolveAndValidateUpdate as jest.fn().
 */
export function createMockAppointmentUpdateBusinessRulesService(): {
  resolveAndValidateUpdate: jest.Mock;
} {
  return {
    resolveAndValidateUpdate: jest.fn(),
  };
}

/**
 * Helper: mock access result for owner scenario (isOwner: true).
 */
export function createMockAccessResultOwner(
  establishmentId: string = DEFAULT_ESTABLISHMENT_ID,
): EstablishmentAccessResult {
  return createMockEstablishmentAccessResult({
    establishmentId,
    isOwner: true,
  });
}

/**
 * Helper: mock access result for barber scenario (isOwner: false, with userEstablishment).
 */
export function createMockAccessResultBarber(
  establishmentId: string = DEFAULT_ESTABLISHMENT_ID,
  userEstablishmentId: string = 'ue-1',
): EstablishmentAccessResult {
  return createMockEstablishmentAccessResult({
    establishmentId,
    isOwner: false,
    userEstablishment: {
      id: userEstablishmentId,
      isActive: true,
      role: UserRole.BARBER,
    },
  });
}
