import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import {
  createMockErrorMessageService,
  DEFAULT_ESTABLISHMENT_ID,
  DEFAULT_REQUESTER_ID,
} from '../__tests__/test-utils';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentCustomerRepository } from '@/modules/establishment-customers/repositories/establishment-customer.repository';
import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';
import { MemberServiceRepository } from '@/modules/member-services/repositories/member-service.repository';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';
import type { EstablishmentAccessResult } from '@/shared/establishment-access/types/establishment-access-result.type';

describe('AppointmentAccessValidationService', () => {
  let service: AppointmentAccessValidationService;

  const mockEstablishmentAccessService = {
    getEstablishmentAccess: jest.fn(),
    assertUserCanAccessEstablishment: jest.fn(),
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

  const mockMemberServiceRepository = {
    findManyByMemberAndServices: jest.fn(),
  };

  const mockErrorMessageService = createMockErrorMessageService();

  const establishmentId = DEFAULT_ESTABLISHMENT_ID;
  const userId = DEFAULT_REQUESTER_ID;
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
          provide: EstablishmentAccessService,
          useValue: mockEstablishmentAccessService,
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
          provide: MemberServiceRepository,
          useValue: mockMemberServiceRepository,
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
    it('deve retornar acesso quando getEstablishmentAccess retorna owner', async () => {
      const ownerResult: EstablishmentAccessResult = {
        establishment: mockEstablishmentWithOwner as never,
        isOwner: true,
      };
      mockEstablishmentAccessService.getEstablishmentAccess.mockResolvedValue(
        ownerResult,
      );

      const result = await service.validateCanCreate(establishmentId, userId);

      expect(result).toEqual(ownerResult);
      expect(result.isOwner).toBe(true);
      expect(result.userEstablishment).toBeUndefined();
      expect(
        mockEstablishmentAccessService.getEstablishmentAccess,
      ).toHaveBeenCalledWith(userId, establishmentId);
    });

    it('deve retornar acesso quando getEstablishmentAccess retorna member', async () => {
      const memberResult: EstablishmentAccessResult = {
        establishment: mockEstablishmentWithMember as never,
        isOwner: false,
        userEstablishment: {
          id: 'ue-id-1',
          isActive: true,
          role: UserRole.BARBER,
        },
      };
      mockEstablishmentAccessService.getEstablishmentAccess.mockResolvedValue(
        memberResult,
      );

      const result = await service.validateCanCreate(establishmentId, userId);

      expect(result).toEqual(memberResult);
      expect(result.isOwner).toBe(false);
      expect(result.userEstablishment).toEqual({
        id: 'ue-id-1',
        isActive: true,
        role: UserRole.BARBER,
      });
    });

    it('deve lançar exceção quando getEstablishmentAccess lança (estabelecimento não encontrado)', async () => {
      mockEstablishmentAccessService.getEstablishmentAccess.mockRejectedValue(
        new CustomHttpException(
          'Estabelecimento não encontrado',
          HttpStatus.NOT_FOUND,
          ErrorCode.ESTABLISHMENT_NOT_FOUND,
        ),
      );

      await expect(
        service.validateCanCreate(establishmentId, userId),
      ).rejects.toThrow(CustomHttpException);

      expect(
        mockEstablishmentAccessService.getEstablishmentAccess,
      ).toHaveBeenCalledWith(userId, establishmentId);
    });

    it('deve lançar exceção com status NOT_FOUND quando estabelecimento não existe', async () => {
      mockEstablishmentAccessService.getEstablishmentAccess.mockRejectedValue(
        new CustomHttpException(
          'Not found',
          HttpStatus.NOT_FOUND,
          ErrorCode.ESTABLISHMENT_NOT_FOUND,
        ),
      );

      try {
        await service.validateCanCreate(establishmentId, userId);
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

    it('deve lançar exceção quando getEstablishmentAccess lança (acesso negado)', async () => {
      mockEstablishmentAccessService.getEstablishmentAccess.mockRejectedValue(
        new CustomHttpException(
          'Acesso negado',
          HttpStatus.FORBIDDEN,
          ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        ),
      );

      await expect(
        service.validateCanCreate(establishmentId, userId),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).not.toHaveBeenCalled();
    });

    it('deve lançar exceção quando membro existe mas está inativo (getEstablishmentAccess lança)', async () => {
      mockEstablishmentAccessService.getEstablishmentAccess.mockRejectedValue(
        new CustomHttpException(
          'Acesso negado',
          HttpStatus.FORBIDDEN,
          ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        ),
      );

      try {
        await service.validateCanCreate(establishmentId, userId);
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
      const accessResult: EstablishmentAccessResult = {
        establishment: mockEstablishment as never,
        isOwner: true,
      };

      expect(() =>
        service.assertRequesterCanActForMember(
          accessResult,
          userId,
          'other-member-id',
        ),
      ).not.toThrow();
    });

    it('não deve lançar quando role é RECEPTIONIST', () => {
      const accessResult: EstablishmentAccessResult = {
        establishment: mockEstablishment as never,
        isOwner: false,
        userEstablishment: {
          id: 'ue-1',
          isActive: true,
          role: UserRole.RECEPTIONIST,
        },
      };

      expect(() =>
        service.assertRequesterCanActForMember(
          accessResult,
          userId,
          'other-member-id',
        ),
      ).not.toThrow();
    });

    it('não deve lançar quando BARBER/HAIRDRESSER atua para si mesmo', () => {
      const accessResult: EstablishmentAccessResult = {
        establishment: mockEstablishment as never,
        isOwner: false,
        userEstablishment: {
          id: 'ue-1',
          isActive: true,
          role: UserRole.BARBER,
        },
      };

      expect(() =>
        service.assertRequesterCanActForMember(accessResult, userId, userId),
      ).not.toThrow();
    });

    it('deve lançar quando BARBER tenta atuar por outro membro', () => {
      const accessResult: EstablishmentAccessResult = {
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
        service.assertRequesterCanActForMember(
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
      const accessResult: EstablishmentAccessResult = {
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
        service.assertRequesterCanActForMember(
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
    const mockMemberServices = [
      {
        id: 'member-svc-1',
        userId,
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

    it('deve retornar serviços do membro quando todos encontrados', async () => {
      mockMemberServiceRepository.findManyByMemberAndServices.mockResolvedValue(
        mockMemberServices,
      );

      const result = await service.validateUserAllowedServices(
        establishmentId,
        userId,
        ['svc-1'],
      );

      expect(result).toEqual(mockMemberServices);
      expect(
        mockMemberServiceRepository.findManyByMemberAndServices,
      ).toHaveBeenCalledWith(userId, establishmentId, ['svc-1']);
    });

    it('deve lançar exceção quando um serviço não está atribuído ao membro', async () => {
      mockMemberServiceRepository.findManyByMemberAndServices.mockResolvedValue(
        [],
      );
      mockErrorMessageService.getMessage.mockReturnValue(
        'Serviço não encontrado para o membro',
      );

      await expect(
        service.validateUserAllowedServices(establishmentId, userId, [
          'svc-unknown',
        ]),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.MEMBER_SERVICE_NOT_FOUND,
        {
          SERVICE_ID: 'svc-unknown',
          MEMBER_ID: userId,
        },
      );
    });

    it('deve lançar exceção quando algum serviço da lista não está atribuído', async () => {
      mockMemberServiceRepository.findManyByMemberAndServices.mockResolvedValue(
        mockMemberServices,
      );
      mockErrorMessageService.getMessage.mockReturnValue(
        'Serviço não encontrado para o membro',
      );

      await expect(
        service.validateUserAllowedServices(establishmentId, userId, [
          'svc-1',
          'svc-2',
        ]),
      ).rejects.toThrow(CustomHttpException);

      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.MEMBER_SERVICE_NOT_FOUND,
        {
          SERVICE_ID: 'svc-2',
          MEMBER_ID: userId,
        },
      );
    });
  });
});
