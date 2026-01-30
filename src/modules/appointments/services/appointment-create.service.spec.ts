import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/library';

import { AppointmentCreateRequestDTO } from '../dtos/api/appointment-create-request.dto';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';
import { AppointmentBusinessRulesService } from './appointment-business-rules.service';
import { AppointmentCreateService } from './appointment-create.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';

describe('AppointmentCreateService', () => {
  let service: AppointmentCreateService;

  const mockAppointmentRepository = {
    create: jest.fn(),
  };

  const mockAppointmentAccessValidationService = {
    validateUserCanCreateAppointments: jest.fn(),
    validateRequesterCanActForMember: jest.fn(),
    validateCustomer: jest.fn(),
    validateUser: jest.fn(),
    validateServices: jest.fn(),
    validateUserAllowedServices: jest.fn(),
  };

  const mockAppointmentBusinessRulesService = {
    calculateTotalsAndEndTime: jest.fn(),
    validateNoTimeConflict: jest.fn(),
    validateTimeRange: jest.fn(),
  };

  const establishmentId = 'est-123';
  const ownerId = 'owner-123';

  const startTime = new Date('2025-06-01T10:00:00.000Z');
  const createDto: AppointmentCreateRequestDTO = {
    customerId: 'cust-123',
    userId: 'user-barber',
    startTime,
    serviceIds: ['svc-1'],
    notes: 'Test notes',
  };

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

  const mockAccessResult = {
    establishment: { id: establishmentId },
    isOwner: true,
  };

  const mockCreatedAppointment = {
    id: 'apt-123',
    establishmentId,
    customerId: createDto.customerId,
    customer: { name: 'Cliente' },
    userId: createDto.userId,
    user: { name: 'Barbeiro' },
    startTime,
    endTime: new Date('2025-06-01T10:30:00.000Z'),
    totalAmount: 3000,
    totalDuration: 30,
    status: 'PENDING',
    notes: createDto.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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
          provide: AppointmentBusinessRulesService,
          useValue: mockAppointmentBusinessRulesService,
        },
      ],
    }).compile();

    service = module.get<AppointmentCreateService>(AppointmentCreateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockAppointmentAccessValidationService.validateRequesterCanActForMember.mockImplementation(
      () => undefined,
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve criar appointment com sucesso quando todas validações passam', async () => {
      mockAppointmentAccessValidationService.validateUserCanCreateAppointments.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentAccessValidationService.validateServices.mockResolvedValue(
        mockEstablishmentServices,
      );
      mockAppointmentBusinessRulesService.calculateTotalsAndEndTime.mockReturnValue(
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
        mockAppointmentAccessValidationService.validateUserCanCreateAppointments,
      ).toHaveBeenCalledWith(establishmentId, ownerId);
      expect(
        mockAppointmentAccessValidationService.validateRequesterCanActForMember,
      ).toHaveBeenCalledWith(mockAccessResult, ownerId, createDto.userId);
      expect(
        mockAppointmentAccessValidationService.validateCustomer,
      ).toHaveBeenCalledWith(establishmentId, createDto.customerId);
      expect(
        mockAppointmentAccessValidationService.validateUser,
      ).toHaveBeenCalledWith(establishmentId, createDto.userId);
      expect(
        mockAppointmentAccessValidationService.validateServices,
      ).toHaveBeenCalledWith(establishmentId, createDto.serviceIds);
      expect(
        mockAppointmentBusinessRulesService.calculateTotalsAndEndTime,
      ).toHaveBeenCalledWith(startTime, mockEstablishmentServices);
      expect(
        mockAppointmentBusinessRulesService.validateNoTimeConflict,
      ).toHaveBeenCalledWith(createDto.userId, startTime, expect.any(Date));
      expect(
        mockAppointmentBusinessRulesService.validateTimeRange,
      ).toHaveBeenCalledWith(startTime, '2025-06-01T10:30:00.000Z');
      expect(mockAppointmentRepository.create).toHaveBeenCalled();
    });

    it('deve lançar exceção quando validateUserCanCreateAppointments falha', async () => {
      mockAppointmentAccessValidationService.validateUserCanCreateAppointments.mockRejectedValue(
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

    it('deve lançar exceção quando validateRequesterCanActForMember lança', async () => {
      mockAppointmentAccessValidationService.validateUserCanCreateAppointments.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentAccessValidationService.validateRequesterCanActForMember.mockImplementation(
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
      mockAppointmentAccessValidationService.validateUserCanCreateAppointments.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentAccessValidationService.validateServices.mockResolvedValue(
        mockEstablishmentServices,
      );
      mockAppointmentBusinessRulesService.calculateTotalsAndEndTime.mockReturnValue(
        {
          totalAmount: 3000,
          totalDuration: 30,
          endTime: '2025-06-01T10:30:00.000Z',
        },
      );
      mockAppointmentBusinessRulesService.validateNoTimeConflict.mockRejectedValue(
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
      mockAppointmentAccessValidationService.validateUserCanCreateAppointments.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentAccessValidationService.validateServices.mockResolvedValue(
        mockEstablishmentServices,
      );
      mockAppointmentBusinessRulesService.calculateTotalsAndEndTime.mockReturnValue(
        {
          totalAmount: 3000,
          totalDuration: 30,
          endTime: '2025-06-01T09:00:00.000Z',
        },
      );
      mockAppointmentBusinessRulesService.validateNoTimeConflict.mockResolvedValue(
        undefined,
      );
      mockAppointmentBusinessRulesService.validateTimeRange.mockImplementation(
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
      mockAppointmentAccessValidationService.validateUserCanCreateAppointments.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentAccessValidationService.validateCustomer.mockResolvedValue(
        undefined,
      );
      mockAppointmentAccessValidationService.validateUser.mockResolvedValue(
        undefined,
      );
      mockAppointmentAccessValidationService.validateServices.mockResolvedValue(
        mockEstablishmentServices,
      );
      mockAppointmentAccessValidationService.validateUserAllowedServices.mockResolvedValue(
        undefined,
      );
      mockAppointmentBusinessRulesService.calculateTotalsAndEndTime.mockReturnValue(
        {
          totalAmount: 3000,
          totalDuration: 30,
          endTime: '2025-06-01T10:30:00.000Z',
        },
      );
      mockAppointmentBusinessRulesService.validateNoTimeConflict.mockResolvedValue(
        undefined,
      );
      mockAppointmentBusinessRulesService.validateTimeRange.mockReturnValue(
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
