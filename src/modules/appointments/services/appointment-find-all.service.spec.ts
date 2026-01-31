import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';

import {
  createMockAccessResultBarber,
  createMockAccessResultOwner,
  createMockAppointmentAccessResult,
  createMockAppointmentAccessValidationService,
  createMockAppointmentRepository,
  DEFAULT_ESTABLISHMENT_ID,
  DEFAULT_REQUESTER_ID,
} from '../__tests__/test-utils';
import { AppointmentFindAllQueryDTO } from '../dtos/api/appointment-find-all-query.dto';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';
import { AppointmentFindAllService } from './appointment-find-all.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';

describe('AppointmentFindAllService', () => {
  let service: AppointmentFindAllService;

  const mockAppointmentRepository = createMockAppointmentRepository();
  const mockAppointmentAccessValidationService =
    createMockAppointmentAccessValidationService();

  const establishmentId = DEFAULT_ESTABLISHMENT_ID;
  const requesterId = DEFAULT_REQUESTER_ID;

  const mockAccessResultOwner = createMockAccessResultOwner(establishmentId);
  const mockAccessResultBarber = createMockAccessResultBarber(establishmentId);

  const mockAppointments = [
    {
      id: 'apt-1',
      establishmentId,
      customerId: 'cust-1',
      customer: { name: 'Cliente' },
      userId: 'user-barber',
      user: { name: 'Barbeiro' },
      startTime: new Date(),
      endTime: new Date(),
      totalAmount: 3000,
      totalDuration: 30,
      status: 'PENDING',
      notes: null,
    },
  ];

  const baseQuery: AppointmentFindAllQueryDTO = {
    page: 1,
    limit: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentFindAllService,
        {
          provide: AppointmentRepository,
          useValue: mockAppointmentRepository,
        },
        {
          provide: AppointmentAccessValidationService,
          useValue: mockAppointmentAccessValidationService,
        },
      ],
    }).compile();

    service = module.get<AppointmentFindAllService>(AppointmentFindAllService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar lista de appointments quando owner e sem filtros', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockResolvedValue(
        mockAccessResultOwner,
      );
      mockAppointmentRepository.findAll.mockResolvedValue(mockAppointments);
      mockAppointmentRepository.count.mockResolvedValue(1);

      const result = await service.execute(
        establishmentId,
        baseQuery,
        requesterId,
      );

      expect(result).toBeInstanceOf(Object);
      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(1);
      expect(result.meta.totalItems).toBe(1);
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.itemsPerPage).toBe(10);
      expect(
        mockAppointmentAccessValidationService.validateCanCreate,
      ).toHaveBeenCalledWith(establishmentId, requesterId);
      expect(mockAppointmentRepository.findAll).toHaveBeenCalled();
      expect(mockAppointmentRepository.count).toHaveBeenCalled();
    });

    it('deve forçar userId ao requesterId quando role é BARBER', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockResolvedValue(
        mockAccessResultBarber,
      );
      mockAppointmentRepository.findAll.mockResolvedValue(mockAppointments);
      mockAppointmentRepository.count.mockResolvedValue(1);

      const result = await service.execute(
        establishmentId,
        { ...baseQuery, userId: 'other-user' },
        requesterId,
      );

      expect(result).toBeDefined();
      const findAllCalls = mockAppointmentRepository.findAll.mock
        .calls as Array<[{ userId?: string }]>;
      expect(findAllCalls[0][0].userId).toBe(requesterId);
    });

    it('deve forçar userId ao requesterId quando role é HAIRDRESSER', async () => {
      const accessResultHairdresser = createMockAppointmentAccessResult({
        establishmentId,
        isOwner: false,
        userEstablishment: {
          id: 'ue-1',
          isActive: true,
          role: UserRole.HAIRDRESSER,
        },
      });
      mockAppointmentAccessValidationService.validateCanCreate.mockResolvedValue(
        accessResultHairdresser,
      );
      mockAppointmentRepository.findAll.mockResolvedValue([]);
      mockAppointmentRepository.count.mockResolvedValue(0);

      await service.execute(establishmentId, baseQuery, requesterId);

      const findAllCalls = mockAppointmentRepository.findAll.mock
        .calls as Array<[{ userId?: string }]>;
      expect(findAllCalls[0][0].userId).toBe(requesterId);
    });

    it('deve validar customer quando customerId é fornecido', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockResolvedValue(
        mockAccessResultOwner,
      );
      mockAppointmentRepository.findAll.mockResolvedValue(mockAppointments);
      mockAppointmentRepository.count.mockResolvedValue(1);

      await service.execute(
        establishmentId,
        { ...baseQuery, customerId: 'cust-123' },
        requesterId,
      );

      expect(
        mockAppointmentAccessValidationService.validateCustomer,
      ).toHaveBeenCalledWith(establishmentId, 'cust-123');
    });

    it('deve validar user quando userId é fornecido (owner)', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockResolvedValue(
        mockAccessResultOwner,
      );
      mockAppointmentRepository.findAll.mockResolvedValue(mockAppointments);
      mockAppointmentRepository.count.mockResolvedValue(1);

      await service.execute(
        establishmentId,
        { ...baseQuery, userId: 'user-barber' },
        requesterId,
      );

      expect(
        mockAppointmentAccessValidationService.validateUser,
      ).toHaveBeenCalledWith(establishmentId, 'user-barber');
    });

    it('deve lançar exceção quando estabelecimento não encontrado', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockRejectedValue(
        new CustomHttpException(
          'Estabelecimento não encontrado',
          HttpStatus.NOT_FOUND,
          ErrorCode.ESTABLISHMENT_NOT_FOUND,
        ),
      );

      await expect(
        service.execute(establishmentId, baseQuery, requesterId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockAppointmentRepository.findAll).not.toHaveBeenCalled();
      expect(mockAppointmentRepository.count).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando validateCustomer falha', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockResolvedValue(
        mockAccessResultOwner,
      );
      mockAppointmentAccessValidationService.validateCustomer.mockRejectedValue(
        new CustomHttpException(
          'Cliente não encontrado',
          HttpStatus.NOT_FOUND,
          ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND,
        ),
      );

      await expect(
        service.execute(
          establishmentId,
          { ...baseQuery, customerId: 'cust-unknown' },
          requesterId,
        ),
      ).rejects.toThrow(CustomHttpException);

      expect(mockAppointmentRepository.findAll).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando validateUser falha', async () => {
      mockAppointmentAccessValidationService.validateCanCreate.mockResolvedValue(
        mockAccessResultOwner,
      );
      mockAppointmentAccessValidationService.validateUser.mockRejectedValue(
        new CustomHttpException(
          'Usuário não encontrado',
          HttpStatus.NOT_FOUND,
          ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        ),
      );

      await expect(
        service.execute(
          establishmentId,
          { ...baseQuery, userId: 'user-unknown' },
          requesterId,
        ),
      ).rejects.toThrow(CustomHttpException);

      expect(mockAppointmentRepository.findAll).not.toHaveBeenCalled();
    });
  });
});
