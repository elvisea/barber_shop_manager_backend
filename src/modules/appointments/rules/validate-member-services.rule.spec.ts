import { Test, TestingModule } from '@nestjs/testing';

import { ValidateMemberServicesRule } from './validate-member-services.rule';

import { AppointmentAccessValidationService } from '../services/appointment-access-validation.service';

describe('ValidateMemberServicesRule', () => {
  let rule: ValidateMemberServicesRule;

  const mockAppointmentAccessValidationService = {
    validateUserAllowedServices: jest.fn().mockResolvedValue(undefined),
  };

  const context = {
    establishmentId: 'est-123',
    userId: 'user-456',
    serviceIds: ['svc-1', 'svc-2'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateMemberServicesRule,
        {
          provide: AppointmentAccessValidationService,
          useValue: mockAppointmentAccessValidationService,
        },
      ],
    }).compile();

    rule = module.get<ValidateMemberServicesRule>(ValidateMemberServicesRule);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(rule).toBeDefined();
  });

  it('deve chamar validateUserAllowedServices com o contexto', async () => {
    await rule.validate(context);

    expect(
      mockAppointmentAccessValidationService.validateUserAllowedServices,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockAppointmentAccessValidationService.validateUserAllowedServices,
    ).toHaveBeenCalledWith(
      context.establishmentId,
      context.userId,
      context.serviceIds,
    );
  });
});
