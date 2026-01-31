import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import {
  createMockAppointment,
  createMockAppointmentAccessResult,
  createMockAppointmentAccessValidationService,
  createMockAppointmentCreateBusinessRulesService,
  DEFAULT_ESTABLISHMENT_ID,
  DEFAULT_REQUESTER_ID,
} from '../__tests__/test-utils';
import { AppointmentUpdateRequestDTO } from '../dtos/api/appointment-update-request.dto';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';
import { AppointmentCreateBusinessRulesService } from './appointment-create-business-rules.service';
import { AppointmentUpdateBusinessRulesService } from './appointment-update-business-rules.service';

describe('AppointmentUpdateBusinessRulesService', () => {
  let service: AppointmentUpdateBusinessRulesService;

  const mockAppointmentCreateBusinessRulesService =
    createMockAppointmentCreateBusinessRulesService();
  const mockAppointmentAccessValidationService =
    createMockAppointmentAccessValidationService();

  const establishmentId = DEFAULT_ESTABLISHMENT_ID;
  const ownerId = DEFAULT_REQUESTER_ID;
  const startTime = new Date('2025-06-01T10:00:00.000Z');
  const endTime = new Date('2025-06-01T11:00:00.000Z');

  const mockAppointment = createMockAppointment({
    id: 'apt-123',
    establishmentId,
    startTime,
    endTime,
    totalAmount: 3000,
    totalDuration: 60,
    status: AppointmentStatus.PENDING,
    services: [{ serviceId: 'svc-1' }] as never,
  });

  const mockAccessResult = createMockAppointmentAccessResult({
    establishmentId,
    isOwner: true,
  });

  const mockEstablishmentServices = [
    {
      id: 'svc-1',
      establishmentId,
      name: 'Corte',
      price: 3000,
      duration: 30,
      commission: new Decimal(50),
      description: null,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentUpdateBusinessRulesService,
        {
          provide: AppointmentCreateBusinessRulesService,
          useValue: mockAppointmentCreateBusinessRulesService,
        },
        {
          provide: AppointmentAccessValidationService,
          useValue: mockAppointmentAccessValidationService,
        },
      ],
    }).compile();

    service = module.get<AppointmentUpdateBusinessRulesService>(
      AppointmentUpdateBusinessRulesService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockAppointmentCreateBusinessRulesService.validateTimeRange.mockImplementation(
      () => undefined,
    );
    mockAppointmentCreateBusinessRulesService.validateNoTimeConflict.mockResolvedValue(
      undefined,
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('resolveAndValidateUpdate', () => {
    it('deve retornar payload efetivo quando apenas notes é alterado', async () => {
      const dto: AppointmentUpdateRequestDTO = { notes: 'Nova observação' };

      const result = await service.resolveAndValidateUpdate(
        dto,
        mockAppointment as never,
        { establishmentId, ownerId, accessResult: mockAccessResult },
      );

      expect(result.effectiveUserId).toBe(mockAppointment.userId);
      expect(result.effectiveStartTime).toEqual(startTime);
      expect(result.endTime).toBe(endTime.toISOString());
      expect(result.totalAmount).toBe(mockAppointment.totalAmount);
      expect(result.totalDuration).toBe(mockAppointment.totalDuration);
      expect(result.effectiveStatus).toBe(AppointmentStatus.PENDING);
      expect(result.effectiveNotes).toBe('Nova observação');
      expect(result.establishmentServicesForUpdate).toBeUndefined();
      expect(
        mockAppointmentAccessValidationService.validateServices,
      ).not.toHaveBeenCalled();
      expect(
        mockAppointmentCreateBusinessRulesService.calculateTotalsAndEndTime,
      ).not.toHaveBeenCalled();
      expect(
        mockAppointmentCreateBusinessRulesService.validateTimeRange,
      ).toHaveBeenCalledWith(startTime, endTime.toISOString());
      expect(
        mockAppointmentCreateBusinessRulesService.validateNoTimeConflict,
      ).toHaveBeenCalledWith(
        mockAppointment.userId,
        startTime,
        endTime,
        mockAppointment.id,
      );
    });

    it('deve validar serviços e recalcular totais quando serviceIds é alterado', async () => {
      const dto: AppointmentUpdateRequestDTO = {
        serviceIds: ['svc-1', 'svc-2'],
      };

      mockAppointmentAccessValidationService.validateServices.mockResolvedValue(
        mockEstablishmentServices,
      );
      mockAppointmentCreateBusinessRulesService.calculateTotalsAndEndTime.mockReturnValue(
        {
          totalAmount: 5000,
          totalDuration: 45,
          endTime: '2025-06-01T10:45:00.000Z',
        },
      );

      const result = await service.resolveAndValidateUpdate(
        dto,
        mockAppointment as never,
        { establishmentId, ownerId, accessResult: mockAccessResult },
      );

      expect(result.totalAmount).toBe(5000);
      expect(result.totalDuration).toBe(45);
      expect(result.endTime).toBe('2025-06-01T10:45:00.000Z');
      expect(result.establishmentServicesForUpdate).toEqual(
        mockEstablishmentServices,
      );
      expect(
        mockAppointmentAccessValidationService.validateServices,
      ).toHaveBeenCalledWith(establishmentId, ['svc-1', 'svc-2']);
      expect(
        mockAppointmentCreateBusinessRulesService.calculateTotalsAndEndTime,
      ).toHaveBeenCalledWith(startTime, mockEstablishmentServices);
    });

    it('deve recalcular endTime quando apenas startTime é alterado', async () => {
      const newStartTime = new Date('2025-06-02T14:00:00.000Z');
      const dto: AppointmentUpdateRequestDTO = { startTime: newStartTime };

      const result = await service.resolveAndValidateUpdate(
        dto,
        mockAppointment as never,
        { establishmentId, ownerId, accessResult: mockAccessResult },
      );

      const expectedEndTime = new Date(
        newStartTime.getTime() + mockAppointment.totalDuration * 60000,
      ).toISOString();
      expect(result.effectiveStartTime).toEqual(newStartTime);
      expect(result.endTime).toBe(expectedEndTime);
      expect(
        mockAppointmentCreateBusinessRulesService.calculateTotalsAndEndTime,
      ).not.toHaveBeenCalled();
      expect(
        mockAppointmentCreateBusinessRulesService.validateTimeRange,
      ).toHaveBeenCalledWith(newStartTime, expectedEndTime);
    });

    it('deve validar novo usuário quando userId é alterado', async () => {
      const newUserId = 'user-other';
      const dto: AppointmentUpdateRequestDTO = { userId: newUserId };

      mockAppointmentAccessValidationService.validateUser.mockResolvedValue(
        undefined,
      );

      const result = await service.resolveAndValidateUpdate(
        dto,
        mockAppointment as never,
        { establishmentId, ownerId, accessResult: mockAccessResult },
      );

      expect(result.effectiveUserId).toBe(newUserId);
      expect(
        mockAppointmentAccessValidationService.assertRequesterCanActForMember,
      ).toHaveBeenCalledWith(mockAccessResult, ownerId, newUserId);
      expect(
        mockAppointmentAccessValidationService.validateUser,
      ).toHaveBeenCalledWith(establishmentId, newUserId);
    });

    it('deve propagar exceção quando validateTimeRange lança', async () => {
      const dto: AppointmentUpdateRequestDTO = {};
      mockAppointmentCreateBusinessRulesService.validateTimeRange.mockImplementation(
        () => {
          throw new Error('Invalid time range');
        },
      );

      await expect(
        service.resolveAndValidateUpdate(dto, mockAppointment as never, {
          establishmentId,
          ownerId,
          accessResult: mockAccessResult,
        }),
      ).rejects.toThrow('Invalid time range');
    });

    it('deve propagar exceção quando validateNoTimeConflict lança', async () => {
      const dto: AppointmentUpdateRequestDTO = {};
      mockAppointmentCreateBusinessRulesService.validateNoTimeConflict.mockRejectedValue(
        new Error('Time conflict'),
      );

      await expect(
        service.resolveAndValidateUpdate(dto, mockAppointment as never, {
          establishmentId,
          ownerId,
          accessResult: mockAccessResult,
        }),
      ).rejects.toThrow('Time conflict');
    });
  });
});
