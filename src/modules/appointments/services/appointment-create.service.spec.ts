import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/library';

import {
  createMockAppointment,
  createMockAppointmentAccessResult,
  createMockAppointmentAccessValidationService,
  createMockAppointmentCreateBusinessRulesService,
  createMockAppointmentRepository,
  DEFAULT_ESTABLISHMENT_ID,
  DEFAULT_REQUESTER_ID,
} from '../__tests__/test-utils';
import { APPOINTMENT_CREATE_BUSINESS_RULES } from '../constants/appointment-create-rules.token';
import { AppointmentCreateRequestDTO } from '../dtos/api/appointment-create-request.dto';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { ValidateMemberServicesRule } from '../rules/validate-member-services.rule';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';
import { AppointmentCreateBusinessRulesService } from './appointment-create-business-rules.service';
import { AppointmentCreateService } from './appointment-create.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';

describe('AppointmentCreateService', () => {
  let service: AppointmentCreateService;

  const mockAppointmentRepository = createMockAppointmentRepository();
  const mockAppointmentAccessValidationService =
    createMockAppointmentAccessValidationService();
  const mockAppointmentCreateBusinessRulesService =
    createMockAppointmentCreateBusinessRulesService();

  const establishmentId = DEFAULT_ESTABLISHMENT_ID;
  const ownerId = DEFAULT_REQUESTER_ID;

  const startTime = new Date('2025-06-01T10:00:00.000Z');
  const createDto: AppointmentCreateRequestDTO = {
    customerId: 'cust-123',
    userId: 'user-barber',
    startTime,
    serviceIds: ['svc-1'],
    notes: 'Test notes',
  };

  const mockMemberServices = [
    {
      id: 'member-svc-1',
      userId: 'user-barber',
      establishmentId,
      serviceId: 'svc-1',
      price: 3000,
      duration: 30,
      commission: new Decimal(50),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      deletedBy: null,
      service: {
        id: 'svc-1',
        establishmentId,
        name: 'Corte',
        price: 2500,
        duration: 25,
        commission: new Decimal(40),
        description: null,
        deletedAt: null,
        deletedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ];

  const mockAccessResult = createMockAppointmentAccessResult({
    establishmentId,
    isOwner: true,
  });

  const mockCreatedAppointment = createMockAppointment({
    id: 'apt-123',
    establishmentId,
    customerId: createDto.customerId,
    userId: createDto.userId,
    startTime,
    endTime: new Date('2025-06-01T10:30:00.000Z'),
    totalAmount: 3000,
    totalDuration: 30,
    notes: createDto.notes,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentCreateService,
        {
          provide: AppointmentRepository,
          useValue: mockAppointmentRepository,
        },
        {
          provide: AppointmentAccessValidationService,
          useValue: mockAppointmentAccessValidationService,
        },
        {
          provide: AppointmentCreateBusinessRulesService,
          useValue: mockAppointmentCreateBusinessRulesService,
        },
        ValidateMemberServicesRule,
        {
          provide: APPOINTMENT_CREATE_BUSINESS_RULES,
          useFactory: (rule: ValidateMemberServicesRule) => [rule],
          inject: [ValidateMemberServicesRule],
        },
      ],
    }).compile();

    service = module.get<AppointmentCreateService>(AppointmentCreateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockAppointmentAccessValidationService.assertRequesterCanActForMember.mockImplementation(
      () => undefined,
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve criar appointment com sucesso quando todas validações passam', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentAccessValidationService.validateUserAllowedServices.mockResolvedValue(
        mockMemberServices,
      );
      mockAppointmentCreateBusinessRulesService.calculateTotalsAndEndTimeFromMemberServices.mockReturnValue(
        {
          totalAmount: 3000,
          totalDuration: 30,
          endTime: '2025-06-01T10:30:00.000Z',
        },
      );
      mockAppointmentRepository.create.mockResolvedValue(
        mockCreatedAppointment,
      );

      const result = await service.execute(createDto, establishmentId, ownerId);

      expect(result).toBeInstanceOf(Object);
      expect(result.id).toBe(mockCreatedAppointment.id);
      expect(result.establishmentId).toBe(establishmentId);
      expect(result.customerName).toBe('Cliente');
      expect(result.memberName).toBe('Barbeiro');
      expect(
        mockAppointmentAccessValidationService.validateCanCreate,
      ).toHaveBeenCalledWith(establishmentId, ownerId);
      expect(
        mockAppointmentAccessValidationService.assertRequesterCanActForMember,
      ).toHaveBeenCalledWith(mockAccessResult, ownerId, createDto.userId);
      expect(
        mockAppointmentAccessValidationService.validateCustomer,
      ).toHaveBeenCalledWith(establishmentId, createDto.customerId);
      expect(
        mockAppointmentAccessValidationService.validateUser,
      ).toHaveBeenCalledWith(establishmentId, createDto.userId);
      expect(
        mockAppointmentAccessValidationService.validateUserAllowedServices,
      ).toHaveBeenCalledWith(
        establishmentId,
        createDto.userId,
        createDto.serviceIds,
      );
      expect(
        mockAppointmentCreateBusinessRulesService.calculateTotalsAndEndTimeFromMemberServices,
      ).toHaveBeenCalledWith(startTime, mockMemberServices);
      expect(
        mockAppointmentCreateBusinessRulesService.validateNoTimeConflict,
      ).toHaveBeenCalledWith(createDto.userId, startTime, expect.any(Date));
      expect(
        mockAppointmentCreateBusinessRulesService.validateTimeRange,
      ).toHaveBeenCalledWith(startTime, '2025-06-01T10:30:00.000Z');
      expect(mockAppointmentRepository.create).toHaveBeenCalled();
    });

    it('deve lançar exceção quando validateCanCreate falha', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockRejectedValue(
        new CustomHttpException(
          'Estabelecimento não encontrado',
          HttpStatus.NOT_FOUND,
          ErrorCode.ESTABLISHMENT_NOT_FOUND,
        ),
      );

      await expect(
        service.execute(createDto, establishmentId, ownerId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando assertRequesterCanActForMember lança', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentAccessValidationService.assertRequesterCanActForMember.mockImplementation(
        () => {
          throw new CustomHttpException(
            'Sem permissão',
            HttpStatus.FORBIDDEN,
            ErrorCode.APPOINTMENT_ACCESS_DENIED,
          );
        },
      );

      await expect(
        service.execute(createDto, establishmentId, ownerId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando validateNoTimeConflict detecta conflito', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentAccessValidationService.validateUserAllowedServices.mockResolvedValue(
        mockMemberServices,
      );
      mockAppointmentCreateBusinessRulesService.calculateTotalsAndEndTimeFromMemberServices.mockReturnValue(
        {
          totalAmount: 3000,
          totalDuration: 30,
          endTime: '2025-06-01T10:30:00.000Z',
        },
      );
      mockAppointmentCreateBusinessRulesService.validateNoTimeConflict.mockRejectedValue(
        new CustomHttpException(
          'Conflito de horário',
          HttpStatus.CONFLICT,
          ErrorCode.MEMBER_APPOINTMENT_CONFLICT,
        ),
      );

      await expect(
        service.execute(createDto, establishmentId, ownerId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando validateTimeRange lança', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentAccessValidationService.validateUserAllowedServices.mockResolvedValue(
        mockMemberServices,
      );
      mockAppointmentCreateBusinessRulesService.calculateTotalsAndEndTimeFromMemberServices.mockReturnValue(
        {
          totalAmount: 3000,
          totalDuration: 30,
          endTime: '2025-06-01T09:00:00.000Z',
        },
      );
      mockAppointmentCreateBusinessRulesService.validateNoTimeConflict.mockResolvedValue(
        undefined,
      );
      mockAppointmentCreateBusinessRulesService.validateTimeRange.mockImplementation(
        () => {
          throw new CustomHttpException(
            'Intervalo inválido',
            HttpStatus.BAD_REQUEST,
            ErrorCode.INVALID_TIME_RANGE,
          );
        },
      );

      await expect(
        service.execute(createDto, establishmentId, ownerId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando repositório falha', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentAccessValidationService.validateCustomer.mockResolvedValue(
        undefined,
      );
      mockAppointmentAccessValidationService.validateUser.mockResolvedValue(
        undefined,
      );
      mockAppointmentAccessValidationService.validateUserAllowedServices.mockResolvedValue(
        mockMemberServices,
      );
      mockAppointmentCreateBusinessRulesService.calculateTotalsAndEndTimeFromMemberServices.mockReturnValue(
        {
          totalAmount: 3000,
          totalDuration: 30,
          endTime: '2025-06-01T10:30:00.000Z',
        },
      );
      mockAppointmentCreateBusinessRulesService.validateNoTimeConflict.mockResolvedValue(
        undefined,
      );
      mockAppointmentCreateBusinessRulesService.validateTimeRange.mockReturnValue(
        undefined,
      );
      mockAppointmentRepository.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.execute(createDto, establishmentId, ownerId),
      ).rejects.toThrow('Database error');

      expect(mockAppointmentRepository.create).toHaveBeenCalled();
    });
  });
});
