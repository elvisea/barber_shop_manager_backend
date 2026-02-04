import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EstablishmentService } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import {
  createMockAppointmentRepository,
  createMockErrorMessageService,
} from '../__tests__/test-utils';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { AppointmentCreateBusinessRulesService } from './appointment-create-business-rules.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

describe('AppointmentCreateBusinessRulesService', () => {
  let service: AppointmentCreateBusinessRulesService;

  const mockAppointmentRepository = createMockAppointmentRepository();
  const mockErrorMessageService = createMockErrorMessageService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentCreateBusinessRulesService,
        {
          provide: AppointmentRepository,
          useValue: mockAppointmentRepository,
        },
        {
          provide: ErrorMessageService,
          useValue: mockErrorMessageService,
        },
      ],
    }).compile();

    service = module.get<AppointmentCreateBusinessRulesService>(
      AppointmentCreateBusinessRulesService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('validateNoTimeConflict', () => {
    const userId = 'user-id-123';
    const startTime = new Date('2025-02-01T10:00:00.000Z');
    const endTime = new Date('2025-02-01T11:00:00.000Z');

    it('deve passar quando não há conflito de horários', async () => {
      mockAppointmentRepository.findConflictingAppointments.mockResolvedValue(
        [],
      );

      await service.validateNoTimeConflict(userId, startTime, endTime);

      expect(
        mockAppointmentRepository.findConflictingAppointments,
      ).toHaveBeenCalledWith(userId, startTime, endTime, undefined);
    });

    it('deve passar quando excludeAppointmentId é informado (update)', async () => {
      mockAppointmentRepository.findConflictingAppointments.mockResolvedValue(
        [],
      );

      await service.validateNoTimeConflict(
        userId,
        startTime,
        endTime,
        'appointment-id-to-exclude',
      );

      expect(
        mockAppointmentRepository.findConflictingAppointments,
      ).toHaveBeenCalledWith(
        userId,
        startTime,
        endTime,
        'appointment-id-to-exclude',
      );
    });

    it('deve lançar CustomHttpException quando há conflito de horários', async () => {
      const conflictingAppointment = {
        id: 'conflict-id',
        startTime: new Date('2025-02-01T10:30:00.000Z'),
        endTime: new Date('2025-02-01T11:30:00.000Z'),
      };
      mockAppointmentRepository.findConflictingAppointments.mockResolvedValue([
        conflictingAppointment,
      ]);
      mockErrorMessageService.getMessage.mockReturnValue(
        'Conflito de horário para o membro',
      );

      await expect(
        service.validateNoTimeConflict(userId, startTime, endTime),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.MEMBER_APPOINTMENT_CONFLICT,
        {
          MEMBER_ID: userId,
          START_TIME: conflictingAppointment.startTime.toISOString(),
          END_TIME: conflictingAppointment.endTime.toISOString(),
        },
      );
    });

    it('deve lançar exceção com status CONFLICT e errorCode correto', async () => {
      mockAppointmentRepository.findConflictingAppointments.mockResolvedValue([
        {
          id: 'conflict-id',
          startTime: new Date(),
          endTime: new Date(),
        },
      ]);
      mockErrorMessageService.getMessage.mockReturnValue(
        'Mensagem de conflito',
      );

      try {
        await service.validateNoTimeConflict(userId, startTime, endTime);
        fail('Deveria ter lançado exceção');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomHttpException);
        expect((error as CustomHttpException).getStatus()).toBe(
          HttpStatus.CONFLICT,
        );
        expect((error as CustomHttpException).getResponse()).toMatchObject({
          errorCode: ErrorCode.MEMBER_APPOINTMENT_CONFLICT,
        });
      }
    });
  });

  describe('validateTimeRange', () => {
    it('deve passar quando startTime é anterior a endTime', () => {
      const startTime = new Date('2025-02-01T10:00:00.000Z');
      const endTime = '2025-02-01T11:00:00.000Z';

      expect(() => service.validateTimeRange(startTime, endTime)).not.toThrow();
    });

    it('deve lançar CustomHttpException quando startTime >= endTime', () => {
      const startTime = new Date('2025-02-01T11:00:00.000Z');
      const endTime = '2025-02-01T10:00:00.000Z';
      mockErrorMessageService.getMessage.mockReturnValue(
        'Horário de início deve ser anterior ao fim',
      );

      expect(() => service.validateTimeRange(startTime, endTime)).toThrow(
        CustomHttpException,
      );

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.INVALID_TIME_RANGE,
        {
          START_TIME: startTime.toISOString(),
          END_TIME: endTime,
        },
      );
    });

    it('deve lançar exceção com status BAD_REQUEST e errorCode correto', () => {
      const startTime = new Date('2025-02-01T11:00:00.000Z');
      const endTime = '2025-02-01T10:00:00.000Z';
      mockErrorMessageService.getMessage.mockReturnValue('Intervalo inválido');

      try {
        service.validateTimeRange(startTime, endTime);
        fail('Deveria ter lançado exceção');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomHttpException);
        expect((error as CustomHttpException).getStatus()).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect((error as CustomHttpException).getResponse()).toMatchObject({
          errorCode: ErrorCode.INVALID_TIME_RANGE,
        });
      }
    });
  });

  describe('calculateTotalsAndEndTime', () => {
    it('deve calcular totalAmount, totalDuration e endTime corretamente', () => {
      const startTime = new Date('2025-02-01T10:00:00.000Z');
      const services: EstablishmentService[] = [
        {
          id: 'svc-1',
          establishmentId: 'est-1',
          name: 'Corte',
          price: 3000,
          duration: 30,
          commission: new Decimal(50.0),
          description: null,
          deletedAt: null,
          deletedBy: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'svc-2',
          establishmentId: 'est-1',
          name: 'Barba',
          price: 2000,
          duration: 15,
          commission: new Decimal(40.0),
          description: null,
          deletedAt: null,
          deletedBy: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const result = service.calculateTotalsAndEndTime(startTime, services);

      expect(result.totalAmount).toBe(5000);
      expect(result.totalDuration).toBe(45);
      expect(result.endTime).toBe(
        new Date(startTime.getTime() + 45 * 60000).toISOString(),
      );
    });

    it('deve retornar zeros e startTime como endTime quando lista de serviços vazia', () => {
      const startTime = new Date('2025-02-01T10:00:00.000Z');

      const result = service.calculateTotalsAndEndTime(startTime, []);

      expect(result.totalAmount).toBe(0);
      expect(result.totalDuration).toBe(0);
      expect(result.endTime).toBe(startTime.toISOString());
    });
  });
});
