import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import {
  createMockAppointment,
  createMockAppointmentAccessResult,
  createMockAppointmentAccessValidationService,
  createMockAppointmentBusinessRulesService,
  createMockAppointmentRepository,
  createMockErrorMessageService,
  DEFAULT_APPOINTMENT_ID,
  DEFAULT_ESTABLISHMENT_ID,
  DEFAULT_REQUESTER_ID,
} from '../__tests__/test-utils';
import { AppointmentUpdateRequestDTO } from '../dtos/api/appointment-update-request.dto';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';
import { AppointmentBusinessRulesService } from './appointment-business-rules.service';
import { AppointmentUpdateService } from './appointment-update.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

describe('AppointmentUpdateService', () => {
  let service: AppointmentUpdateService;

  const mockAppointmentRepository = createMockAppointmentRepository();
  const mockAppointmentAccessValidationService =
    createMockAppointmentAccessValidationService();
  const mockAppointmentBusinessRulesService =
    createMockAppointmentBusinessRulesService();
  const mockErrorMessageService = createMockErrorMessageService();

  const establishmentId = DEFAULT_ESTABLISHMENT_ID;
  const appointmentId = DEFAULT_APPOINTMENT_ID;
  const ownerId = DEFAULT_REQUESTER_ID;

  const startTime = new Date('2025-06-01T10:00:00.000Z');
  const endTime = new Date('2025-06-01T11:00:00.000Z');

  const mockAppointment = createMockAppointment({
    id: appointmentId,
    establishmentId,
    startTime,
    endTime,
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

  const mockUpdatedAppointment = {
    ...mockAppointment,
    notes: 'Updated notes',
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentUpdateService,
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
        {
          provide: ErrorMessageService,
          useValue: mockErrorMessageService,
        },
      ],
    }).compile();

    service = module.get<AppointmentUpdateService>(AppointmentUpdateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve atualizar appointment com sucesso sem alterar serviços', async () => {
      const updateDto: AppointmentUpdateRequestDTO = {
        notes: 'Updated notes',
      };

      mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
      mockAppointmentAccessValidationService.validateUserCanCreateAppointments.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentRepository.update.mockResolvedValue(
        mockUpdatedAppointment,
      );

      const result = await service.execute(
        establishmentId,
        appointmentId,
        updateDto,
        ownerId,
      );

      expect(result).toBeInstanceOf(Object);
      expect(result.id).toBe(appointmentId);
      expect(
        mockAppointmentAccessValidationService.validateServices,
      ).not.toHaveBeenCalled();
      expect(
        mockAppointmentBusinessRulesService.calculateTotalsAndEndTime,
      ).not.toHaveBeenCalled();
      expect(
        mockAppointmentBusinessRulesService.validateTimeRange,
      ).toHaveBeenCalledWith(startTime, endTime.toISOString());
      expect(
        mockAppointmentBusinessRulesService.validateNoTimeConflict,
      ).toHaveBeenCalledWith(
        mockAppointment.userId,
        startTime,
        endTime,
        appointmentId,
      );
      expect(mockAppointmentRepository.update).toHaveBeenCalledWith(
        appointmentId,
        expect.any(Object),
      );
    });

    it('deve atualizar appointment com alteração de serviços', async () => {
      const updateDto: AppointmentUpdateRequestDTO = {
        serviceIds: ['svc-1', 'svc-2'],
      };

      mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
      mockAppointmentAccessValidationService.validateUserCanCreateAppointments.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentAccessValidationService.validateServices.mockResolvedValue(
        mockEstablishmentServices,
      );
      mockAppointmentBusinessRulesService.calculateTotalsAndEndTime.mockReturnValue(
        {
          totalAmount: 5000,
          totalDuration: 45,
          endTime: '2025-06-01T10:45:00.000Z',
        },
      );
      mockAppointmentRepository.update.mockResolvedValue({
        ...mockAppointment,
        totalAmount: 5000,
        totalDuration: 45,
        endTime: new Date('2025-06-01T10:45:00.000Z'),
      });

      await service.execute(establishmentId, appointmentId, updateDto, ownerId);

      expect(
        mockAppointmentAccessValidationService.validateServices,
      ).toHaveBeenCalledWith(establishmentId, ['svc-1', 'svc-2']);
      expect(
        mockAppointmentBusinessRulesService.calculateTotalsAndEndTime,
      ).toHaveBeenCalled();
      expect(mockAppointmentRepository.update).toHaveBeenCalledWith(
        appointmentId,
        expect.objectContaining({
          totalAmount: 5000,
          totalDuration: 45,
        }),
      );
    });

    it('deve lançar exceção quando appointment não encontrado', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);
      mockErrorMessageService.getMessage.mockReturnValue(
        'Agendamento não encontrado',
      );

      await expect(
        service.execute(establishmentId, appointmentId, {}, ownerId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.APPOINTMENT_NOT_FOUND,
        { APPOINTMENT_ID: appointmentId },
      );
      expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando appointment pertence a outro estabelecimento', async () => {
      mockAppointmentRepository.findById.mockResolvedValue({
        ...mockAppointment,
        establishmentId: 'other-est',
      });
      mockErrorMessageService.getMessage.mockReturnValue(
        'Agendamento não encontrado',
      );

      await expect(
        service.execute(establishmentId, appointmentId, {}, ownerId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar exceção com status NOT_FOUND e errorCode correto', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);
      mockErrorMessageService.getMessage.mockReturnValue('Not found');

      try {
        await service.execute(establishmentId, appointmentId, {}, ownerId);
        fail('Deveria ter lançado exceção');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomHttpException);
        expect((error as CustomHttpException).getStatus()).toBe(
          HttpStatus.NOT_FOUND,
        );
        expect((error as CustomHttpException).getResponse()).toMatchObject({
          errorCode: ErrorCode.APPOINTMENT_NOT_FOUND,
        });
      }
    });

    it('deve propagar exceção quando validateUserCanCreateAppointments falha', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
      mockAppointmentAccessValidationService.validateUserCanCreateAppointments.mockRejectedValue(
        new CustomHttpException(
          'Acesso negado',
          HttpStatus.FORBIDDEN,
          ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        ),
      );

      await expect(
        service.execute(establishmentId, appointmentId, {}, ownerId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
    });

    it('deve propagar exceção quando validateNoTimeConflict detecta conflito', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
      mockAppointmentAccessValidationService.validateUserCanCreateAppointments.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentBusinessRulesService.validateNoTimeConflict.mockRejectedValue(
        new CustomHttpException(
          'Conflito de horário',
          HttpStatus.CONFLICT,
          ErrorCode.MEMBER_APPOINTMENT_CONFLICT,
        ),
      );

      await expect(
        service.execute(establishmentId, appointmentId, {}, ownerId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
    });

    it('deve propagar exceção quando repositório update falha', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
      mockAppointmentAccessValidationService.validateUserCanCreateAppointments.mockResolvedValue(
        mockAccessResult,
      );
      mockAppointmentBusinessRulesService.validateTimeRange.mockReturnValue(
        undefined,
      );
      mockAppointmentBusinessRulesService.validateNoTimeConflict.mockResolvedValue(
        undefined,
      );
      mockAppointmentRepository.update.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.execute(establishmentId, appointmentId, {}, ownerId),
      ).rejects.toThrow(Error);

      expect(mockAppointmentRepository.update).toHaveBeenCalled();
    });
  });
});
