import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';

import { EstablishmentAccessService } from './establishment-access.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

describe('EstablishmentAccessService', () => {
  let service: EstablishmentAccessService;

  const establishmentId = 'est-123';
  const userId = 'user-123';
  const ownerId = 'owner-456';

  const mockEstablishment = {
    id: establishmentId,
    ownerId,
    name: 'Barbearia',
    phone: '+5511999999999',
    address: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    deletedBy: null,
  };

  const mockEstablishmentRepository = {
    findByIdWithUserAccess: jest.fn(),
  };

  const mockErrorMessageService = {
    getMessage: jest.fn((errorCode: ErrorCode) => `Mock message for ${errorCode}`),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstablishmentAccessService,
        {
          provide: EstablishmentRepository,
          useValue: mockEstablishmentRepository,
        },
        {
          provide: ErrorMessageService,
          useValue: mockErrorMessageService,
        },
      ],
    }).compile();

    service = module.get<EstablishmentAccessService>(EstablishmentAccessService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('getEstablishmentAccess', () => {
    it('deve retornar acesso quando usuário é dono do estabelecimento', async () => {
      const resultWithOwner = {
        ...mockEstablishment,
        ownerId: userId,
        userEstablishments: [],
      };
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue(
        resultWithOwner,
      );

      const result = await service.getEstablishmentAccess(
        userId,
        establishmentId,
      );

      expect(result.establishment).toEqual(resultWithOwner);
      expect(result.isOwner).toBe(true);
      expect(result.userEstablishment).toBeUndefined();
      expect(
        mockEstablishmentRepository.findByIdWithUserAccess,
      ).toHaveBeenCalledWith(establishmentId, userId);
    });

    it('deve retornar acesso quando usuário é membro ativo', async () => {
      const resultWithMember = {
        ...mockEstablishment,
        userEstablishments: [
          {
            id: 'ue-1',
            isActive: true,
            role: UserRole.BARBER,
          },
        ],
      };
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue(
        resultWithMember,
      );

      const result = await service.getEstablishmentAccess(
        userId,
        establishmentId,
      );

      expect(result.establishment).toEqual(resultWithMember);
      expect(result.isOwner).toBe(false);
      expect(result.userEstablishment).toEqual({
        id: 'ue-1',
        isActive: true,
        role: UserRole.BARBER,
      });
    });

    it('deve lançar NOT_FOUND quando estabelecimento não é encontrado', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue(
        null,
      );
      mockErrorMessageService.getMessage.mockReturnValue(
        'Estabelecimento não encontrado',
      );

      let thrown: unknown;
      try {
        await service.getEstablishmentAccess(userId, establishmentId);
      } catch (error) {
        thrown = error;
      }
      expect(thrown).toBeInstanceOf(CustomHttpException);
      expect((thrown as CustomHttpException).getStatus()).toBe(
        HttpStatus.NOT_FOUND,
      );
      expect((thrown as CustomHttpException).getResponse()).toMatchObject({
        errorCode: ErrorCode.ESTABLISHMENT_NOT_FOUND,
      });
      expect(mockErrorMessageService.getMessage).toHaveBeenCalledWith(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId },
      );
    });

    it('deve lançar FORBIDDEN quando não é dono e não há membro ativo', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue({
        ...mockEstablishment,
        userEstablishments: [],
      });
      mockErrorMessageService.getMessage.mockReturnValue('Acesso negado');

      let thrown: unknown;
      try {
        await service.getEstablishmentAccess(userId, establishmentId);
      } catch (error) {
        thrown = error;
      }
      expect(thrown).toBeInstanceOf(CustomHttpException);
      expect((thrown as CustomHttpException).getStatus()).toBe(
        HttpStatus.FORBIDDEN,
      );
      expect((thrown as CustomHttpException).getResponse()).toMatchObject({
        errorCode: ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      });
    });

    it('deve lançar FORBIDDEN quando membro existe mas está inativo', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue({
        ...mockEstablishment,
        userEstablishments: [
          { id: 'ue-1', isActive: false, role: UserRole.BARBER },
        ],
      });
      mockErrorMessageService.getMessage.mockReturnValue('Acesso negado');

      let thrown: unknown;
      try {
        await service.getEstablishmentAccess(userId, establishmentId);
      } catch (error) {
        thrown = error;
      }
      expect(thrown).toBeInstanceOf(CustomHttpException);
      expect((thrown as CustomHttpException).getStatus()).toBe(
        HttpStatus.FORBIDDEN,
      );
    });
  });

  describe('assertUserCanAccessEstablishment', () => {
    it('não deve lançar quando repositório retorna owner', async () => {
      const resultWithOwner = {
        ...mockEstablishment,
        ownerId: userId,
        userEstablishments: [],
      };
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue(
        resultWithOwner,
      );

      await expect(
        service.assertUserCanAccessEstablishment(userId, establishmentId),
      ).resolves.toBeUndefined();
    });

    it('não deve lançar quando repositório retorna member ativo', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue({
        ...mockEstablishment,
        userEstablishments: [
          { id: 'ue-1', isActive: true, role: UserRole.RECEPTIONIST },
        ],
      });

      await expect(
        service.assertUserCanAccessEstablishment(userId, establishmentId),
      ).resolves.toBeUndefined();
    });

    it('deve lançar quando repositório retorna null', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue(
        null,
      );

      await expect(
        service.assertUserCanAccessEstablishment(userId, establishmentId),
      ).rejects.toThrow(CustomHttpException);
    });

    it('deve lançar quando não é owner e userEstablishments está vazio', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue({
        ...mockEstablishment,
        userEstablishments: [],
      });

      await expect(
        service.assertUserCanAccessEstablishment(userId, establishmentId),
      ).rejects.toThrow(CustomHttpException);
    });

    it('deve lançar quando member existe mas isActive false', async () => {
      mockEstablishmentRepository.findByIdWithUserAccess.mockResolvedValue({
        ...mockEstablishment,
        userEstablishments: [
          { id: 'ue-1', isActive: false, role: UserRole.BARBER },
        ],
      });

      await expect(
        service.assertUserCanAccessEstablishment(userId, establishmentId),
      ).rejects.toThrow(CustomHttpException);
    });
  });
});
