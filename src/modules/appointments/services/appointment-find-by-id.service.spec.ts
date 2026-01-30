import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  createMockAppointment,
  createMockAppointmentAccessResult,
  createMockAppointmentAccessValidationService,
  createMockAppointmentRepository,
  createMockErrorMessageService,
  DEFAULT_APPOINTMENT_ID,
  DEFAULT_ESTABLISHMENT_ID,
  DEFAULT_REQUESTER_ID,
} from '../__tests__/test-utils';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';
import { AppointmentFindByIdService } from './appointment-find-by-id.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

describe('AppointmentFindByIdService', () => {
  let service: AppointmentFindByIdService;

  const mockAppointmentRepository = createMockAppointmentRepository();
  const mockAppointmentAccessValidationService =
    createMockAppointmentAccessValidationService();
  const mockErrorMessageService = createMockErrorMessageService();

  const establishmentId = DEFAULT_ESTABLISHMENT_ID;
  const appointmentId = DEFAULT_APPOINTMENT_ID;
  const requesterId = DEFAULT_REQUESTER_ID;

  const mockAppointment = createMockAppointment({
    id: appointmentId,
    establishmentId,
  });

  const mockAccessResult = createMockAppointmentAccessResult({
    establishmentId,
    isOwner: true,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentFindByIdService,
        {
          provide: AppointmentRepository,
          useValue: mockAppointmentRepository,
        },
        {
          provide: AppointmentAccessValidationService,
          useValue: mockAppointmentAccessValidationService,
        },
        {
          provide: ErrorMessageService,
          useValue: mockErrorMessageService,
        },
      ],
    }).compile();

    service = module.get<AppointmentFindByIdService>(
      AppointmentFindByIdService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar appointment quando encontrado e requester tem acesso', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
      mockAppointmentAccessValidationService.validateUserCanCreateAppointments.mockResolvedValue(
        mockAccessResult,
      );

      const result = await service.execute(
        establishmentId,
        appointmentId,
        requesterId,
      );

      expect(result).toBeInstanceOf(Object);
      expect(result.id).toBe(appointmentId);
      expect(result.establishmentId).toBe(establishmentId);
      expect(result.customerName).toBe('Cliente');
      expect(result.memberName).toBe('Barbeiro');
      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(
        appointmentId,
      );
      expect(
        mockAppointmentAccessValidationService.validateUserCanCreateAppointments,
      ).toHaveBeenCalledWith(establishmentId, requesterId);
      expect(
        mockAppointmentAccessValidationService.validateRequesterCanActForMember,
      ).toHaveBeenCalledWith(
        mockAccessResult,
        requesterId,
        mockAppointment.userId,
      );
    });

    it('deve lançar exceção quando appointment não encontrado', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);
      mockErrorMessageService.getMessage.mockReturnValue(
        'Agendamento não encontrado',
      );

      await expect(
        service.execute(establishmentId, appointmentId, requesterId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.APPOINTMENT_NOT_FOUND,
        { APPOINTMENT_ID: appointmentId },
      );
      expect(
        mockAppointmentAccessValidationService.validateUserCanCreateAppointments,
      ).not.toHaveBeenCalled();
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
        service.execute(establishmentId, appointmentId, requesterId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.APPOINTMENT_NOT_FOUND,
        { APPOINTMENT_ID: appointmentId },
      );
      expect(
        mockAppointmentAccessValidationService.validateUserCanCreateAppointments,
      ).not.toHaveBeenCalled();
    });

    it('deve lançar exceção com status NOT_FOUND e errorCode correto', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);
      mockErrorMessageService.getMessage.mockReturnValue('Not found');

      try {
        await service.execute(establishmentId, appointmentId, requesterId);
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
        service.execute(establishmentId, appointmentId, requesterId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(
        appointmentId,
      );
    });

    it('deve propagar exceção quando validateRequesterCanActForMember lança', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
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
        service.execute(establishmentId, appointmentId, requesterId),
      ).rejects.toThrow(CustomHttpException);

      expect(
        mockAppointmentAccessValidationService.validateRequesterCanActForMember,
      ).toHaveBeenCalledWith(
        mockAccessResult,
        requesterId,
        mockAppointment.userId,
      );
    });
  });
});
