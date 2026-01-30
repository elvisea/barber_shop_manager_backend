import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import {
  AppointmentAccessValidationService,
  AppointmentAccessValidationResult,
} from './appointment-access-validation.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';
import { EstablishmentCustomerRepository } from '@/modules/establishment-customers/repositories/establishment-customer.repository';
import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

describe('AppointmentAccessValidationService', () => {
  let service: AppointmentAccessValidationService;

  const mockEstablishmentRepository = {
    findByIdWithUserAccess: jest.fn(),
  };

  const mockUserEstablishmentRepository = {
    findByUserAndEstablishment: jest.fn(),
  };

  const mockEstablishmentCustomerRepository = {
    findByIdAndEstablishment: jest.fn(),
  };

  const mockEstablishmentServiceRepository = {
    findManyByIdsAndEstablishment: jest.fn(),
  };

  const mockErrorMessageService = {
    getMessage: jest.fn(),
  };

  const establishmentId = 'est-123';
  const userId = 'user-123';
  const ownerId = 'owner-123';

  const mockEstablishment = {
    id: establishmentId,
    ownerId,
    name: 'Barbearia',
    phone: '+5511999999999',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockEstablishmentWithOwner = {
    ...mockEstablishment,
    ownerId: userId,
    userEstablishments: [],
  };

  const mockEstablishmentWithMember = {
    ...mockEstablishment,
    userEstablishments: [
      {
        id: 'ue-id-1',
        isActive: true,
        role: UserRole.BARBER,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentAccessValidationService,
        {
          provide: EstablishmentRepository,
          useValue: mockEstablishmentRepository,
        },
        {
          provide: UserEstablishmentRepository,
          useValue: mockUserEstablishmentRepository,
        },
        {
          provide: EstablishmentCustomerRepository,
          useValue: mockEstablishmentCustomerRepository,
        },
        {
          provide: EstablishmentServiceRepository,
          useValue: mockEstablishmentServiceRepository,
        },
        {
          provide: ErrorMessageService,
          useValue: mockErrorMessageService,
        },
      ],
    }).compile();

    service = module.get<AppointmentAccessValidationService>(
      AppointmentAccessValidationService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('validateUserCanCreateAppointments', () => {
    it('deve retornar acesso quando usuário é dono do estabelecimento', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue(
        mockEstablishmentWithOwner,
      );

      const result = await service.validateUserCanCreateAppointments(
        establishmentId,
        userId,
      );

      expect(result.establishment).toEqual(mockEstablishmentWithOwner);
      expect(result.isOwner).toBe(true);
      expect(result.userEstablishment).toBeUndefined();
      expect(
        mockEstablishmentRepository.findByIdWithUserAccess,
      ).toHaveBeenCalledWith(establishmentId, userId);
    });

    it('deve retornar acesso quando usuário é membro ativo', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue(
        mockEstablishmentWithMember,
      );

      const result = await service.validateUserCanCreateAppointments(
        establishmentId,
        userId,
      );

      expect(result.establishment).toEqual(mockEstablishmentWithMember);
      expect(result.isOwner).toBe(false);
      expect(result.userEstablishment).toEqual({
        id: 'ue-id-1',
        isActive: true,
        role: UserRole.BARBER,
      });
    });

    it('deve lançar exceção quando estabelecimento não é encontrado', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue(
        null,
      );
      mockErrorMessageService.getMessage.mockReturnValue(
        'Estabelecimento não encontrado',
      );

      await expect(
        service.validateUserCanCreateAppointments(establishmentId, userId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId },
      );
    });

    it('deve lançar exceção com status NOT_FOUND quando estabelecimento não existe', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue(
        null,
      );
      mockErrorMessageService.getMessage.mockReturnValue('Not found');

      try {
        await service.validateUserCanCreateAppointments(
          establishmentId,
          userId,
        );
        fail('Deveria ter lançado exceção');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomHttpException);
        expect((error as CustomHttpException).getStatus()).toBe(
          HttpStatus.NOT_FOUND,
        );
        expect((error as CustomHttpException).getResponse()).toMatchObject({
          errorCode: ErrorCode.ESTABLISHMENT_NOT_FOUND,
        });
      }
    });

    it('deve lançar exceção quando usuário não é dono nem membro ativo', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue({
        ...mockEstablishment,
        userEstablishments: [],
      });
      mockErrorMessageService.getMessage.mockReturnValue('Acesso negado');

      await expect(
        service.validateUserCanCreateAppointments(establishmentId, userId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: userId },
      );
    });

    it('deve lançar exceção quando membro existe mas está inativo', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue({
        ...mockEstablishment,
        userEstablishments: [
          { id: 'ue-1', isActive: false, role: UserRole.BARBER },
        ],
      });
      mockErrorMessageService.getMessage.mockReturnValue('Acesso negado');

      try {
        await service.validateUserCanCreateAppointments(
          establishmentId,
          userId,
        );
        fail('Deveria ter lançado exceção');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomHttpException);
        expect((error as CustomHttpException).getStatus()).toBe(
          HttpStatus.FORBIDDEN,
        );
        expect((error as CustomHttpException).getResponse()).toMatchObject({
          errorCode: ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        });
      }
    });
  });

  describe('validateRequesterCanActForMember', () => {
    it('não deve lançar quando accessResult é owner', () => {
      const accessResult: AppointmentAccessValidationResult = {
        establishment: mockEstablishment as never,
        isOwner: true,
      };

      expect(() =>
        service.validateRequesterCanActForMember(
          accessResult,
          userId,
          'other-member-id',
        ),
      ).not.toThrow();
    });

    it('não deve lançar quando role é RECEPTIONIST', () => {
      const accessResult: AppointmentAccessValidationResult = {
        establishment: mockEstablishment as never,
        isOwner: false,
        userEstablishment: {
          id: 'ue-1',
          isActive: true,
          role: UserRole.RECEPTIONIST,
        },
      };

      expect(() =>
        service.validateRequesterCanActForMember(
          accessResult,
          userId,
          'other-member-id',
        ),
      ).not.toThrow();
    });

    it('não deve lançar quando BARBER/HAIRDRESSER atua para si mesmo', () => {
      const accessResult: AppointmentAccessValidationResult = {
        establishment: mockEstablishment as never,
        isOwner: false,
        userEstablishment: {
          id: 'ue-1',
          isActive: true,
          role: UserRole.BARBER,
        },
      };

      expect(() =>
        service.validateRequesterCanActForMember(accessResult, userId, userId),
      ).not.toThrow();
    });

    it('deve lançar quando BARBER tenta atuar por outro membro', () => {
      const accessResult: AppointmentAccessValidationResult = {
        establishment: mockEstablishment as never,
        isOwner: false,
        userEstablishment: {
          id: 'ue-1',
          isActive: true,
          role: UserRole.BARBER,
        },
      };
      mockErrorMessageService.getMessage.mockReturnValue(
        'Sem permissão para atuar por outro membro',
      );

      expect(() =>
        service.validateRequesterCanActForMember(
          accessResult,
          userId,
          'other-member-id',
        ),
      ).toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.APPOINTMENT_ACCESS_DENIED,
      );
    });

    it('deve lançar exceção com status FORBIDDEN e errorCode APPOINTMENT_ACCESS_DENIED', () => {
      const accessResult: AppointmentAccessValidationResult = {
        establishment: mockEstablishment as never,
        isOwner: false,
        userEstablishment: {
          id: 'ue-1',
          isActive: true,
          role: UserRole.HAIRDRESSER,
        },
      };
      mockErrorMessageService.getMessage.mockReturnValue('Access denied');

      try {
        service.validateRequesterCanActForMember(
          accessResult,
          userId,
          'other-member-id',
        );
        fail('Deveria ter lançado exceção');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomHttpException);
        expect((error as CustomHttpException).getStatus()).toBe(
          HttpStatus.FORBIDDEN,
        );
        expect((error as CustomHttpException).getResponse()).toMatchObject({
          errorCode: ErrorCode.APPOINTMENT_ACCESS_DENIED,
        });
      }
    });
  });

  describe('validateCustomer', () => {
    it('deve retornar cliente quando encontrado no estabelecimento', async () => {
      const mockCustomer = {
        id: 'cust-123',
        establishmentId,
        name: 'Cliente',
        phone: '+5511888888888',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockEstablishmentCustomerRepository.findByIdAndEstablishment.mockResolvedValue(
        mockCustomer,
      );

      const result = await service.validateCustomer(
        establishmentId,
        'cust-123',
      );

      expect(result).toEqual(mockCustomer);
      expect(
        mockEstablishmentCustomerRepository.findByIdAndEstablishment,
      ).toHaveBeenCalledWith('cust-123', establishmentId);
    });

    it('deve lançar exceção quando cliente não encontrado', async () => {
      mockEstablishmentCustomerRepository.findByIdAndEstablishment.mockResolvedValue(
        null,
      );
      mockErrorMessageService.getMessage.mockReturnValue(
        'Cliente não encontrado',
      );

      await expect(
        service.validateCustomer(establishmentId, 'cust-unknown'),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND,
        {
          CUSTOMER_ID: 'cust-unknown',
          ESTABLISHMENT_ID: establishmentId,
        },
      );
    });
  });

  describe('validateUser', () => {
    it('deve retornar userEstablishment quando encontrado e ativo', async () => {
      const mockUserEstablishment = {
        id: 'ue-1',
        userId,
        establishmentId,
        role: UserRole.BARBER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserEstablishmentRepository.findByUserAndEstablishment.mockResolvedValue(
        mockUserEstablishment,
      );

      const result = await service.validateUser(establishmentId, userId);

      expect(result).toEqual(mockUserEstablishment);
      expect(
        mockUserEstablishmentRepository.findByUserAndEstablishment,
      ).toHaveBeenCalledWith(userId, establishmentId);
    });

    it('deve lançar exceção quando usuário não encontrado no estabelecimento', async () => {
      mockUserEstablishmentRepository.findByUserAndEstablishment.mockResolvedValue(
        null,
      );
      mockErrorMessageService.getMessage.mockReturnValue(
        'Usuário não encontrado',
      );

      await expect(
        service.validateUser(establishmentId, 'user-unknown'),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        {
          ESTABLISHMENT_ID: establishmentId,
          USER_ID: 'user-unknown',
        },
      );
    });

    it('deve lançar exceção quando usuário está inativo', async () => {
      mockUserEstablishmentRepository.findByUserAndEstablishment.mockResolvedValue(
        {
          id: 'ue-1',
          userId,
          establishmentId,
          role: UserRole.BARBER,
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      );
      mockErrorMessageService.getMessage.mockReturnValue('Acesso negado');

      await expect(
        service.validateUser(establishmentId, userId),
      ).rejects.toThrow(CustomHttpException);
    });
  });

  describe('validateServices', () => {
    it('deve retornar serviços quando todos encontrados', async () => {
      const mockServices = [
        {
          id: 'svc-1',
          establishmentId,
          name: 'Corte',
          price: 3000,
          duration: 30,
          commission: new Decimal(50),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockEstablishmentServiceRepository.findManyByIdsAndEstablishment.mockResolvedValue(
        mockServices,
      );

      const result = await service.validateServices(establishmentId, ['svc-1']);

      expect(result).toEqual(mockServices);
      expect(
        mockEstablishmentServiceRepository.findManyByIdsAndEstablishment,
      ).toHaveBeenCalledWith(establishmentId, ['svc-1']);
    });

    it('deve lançar exceção quando um serviço não existe no estabelecimento', async () => {
      mockEstablishmentServiceRepository.findManyByIdsAndEstablishment.mockResolvedValue(
        [],
      );
      mockErrorMessageService.getMessage.mockReturnValue(
        'Serviço não encontrado',
      );

      await expect(
        service.validateServices(establishmentId, ['svc-unknown']),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
        {
          SERVICE_ID: 'svc-unknown',
          ESTABLISHMENT_ID: establishmentId,
        },
      );
    });

    it('deve lançar exceção quando ordem de serviceIds não é atendida (serviço faltando)', async () => {
      mockEstablishmentServiceRepository.findManyByIdsAndEstablishment.mockResolvedValue(
        [
          {
            id: 'svc-1',
            establishmentId,
            name: 'Corte',
            price: 3000,
            duration: 30,
            commission: new Decimal(50),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      );
      mockErrorMessageService.getMessage.mockReturnValue(
        'Serviço não encontrado',
      );

      await expect(
        service.validateServices(establishmentId, ['svc-1', 'svc-2']),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
        {
          SERVICE_ID: 'svc-2',
          ESTABLISHMENT_ID: establishmentId,
        },
      );
    });
  });

  describe('validateUserAllowedServices', () => {
    it('deve passar quando validateUser passa', async () => {
      const mockUserEstablishment = {
        id: 'ue-1',
        userId,
        establishmentId,
        role: UserRole.BARBER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserEstablishmentRepository.findByUserAndEstablishment.mockResolvedValue(
        mockUserEstablishment,
      );

      await service.validateUserAllowedServices(establishmentId, userId, [
        'svc-1',
      ]);

      expect(
        mockUserEstablishmentRepository.findByUserAndEstablishment,
      ).toHaveBeenCalledWith(userId, establishmentId);
    });
  });
});
