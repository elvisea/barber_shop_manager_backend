import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';

import { UserEstablishmentValidateAccessService } from './user-establishment-validate-access.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

describe('UserEstablishmentValidateAccessService', () => {
  let service: UserEstablishmentValidateAccessService;

  const userId = 'user-123';
  const establishmentId = 'est-456';
  const ownerId = 'owner-789';

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

  const mockUserEstablishmentRepository = {
    findByUserAndEstablishment: jest.fn(),
  };

  const mockEstablishmentRepository = {
    findById: jest.fn(),
  };

  const mockErrorMessageService = {
    getMessage: jest.fn((code: ErrorCode) => `Mock message for ${code}`),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserEstablishmentValidateAccessService,
        {
          provide: UserEstablishmentRepository,
          useValue: mockUserEstablishmentRepository,
        },
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

    service = module.get<UserEstablishmentValidateAccessService>(
      UserEstablishmentValidateAccessService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('não deve lançar quando usuário é dono do estabelecimento', async () => {
      mockEstablishmentRepository.findById.mockResolvedValue({
        ...mockEstablishment,
        ownerId: userId,
      });
      mockUserEstablishmentRepository.findByUserAndEstablishment.mockResolvedValue(
        null,
      );

      await expect(
        service.execute(userId, establishmentId),
      ).resolves.toBeUndefined();

      expect(mockEstablishmentRepository.findById).toHaveBeenCalledWith(
        establishmentId,
      );
    });

    it('não deve lançar quando usuário é membro ativo', async () => {
      mockEstablishmentRepository.findById.mockResolvedValue(mockEstablishment);
      mockUserEstablishmentRepository.findByUserAndEstablishment.mockResolvedValue(
        {
          id: 'ue-1',
          userId,
          establishmentId,
          isActive: true,
          role: UserRole.BARBER,
        },
      );

      await expect(
        service.execute(userId, establishmentId),
      ).resolves.toBeUndefined();
    });

    it('deve lançar FORBIDDEN quando não é dono e não é membro ativo', async () => {
      mockEstablishmentRepository.findById.mockResolvedValue(mockEstablishment);
      mockUserEstablishmentRepository.findByUserAndEstablishment.mockResolvedValue(
        null,
      );

      let thrown: CustomHttpException;
      try {
        await service.execute(userId, establishmentId);
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown!).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.FORBIDDEN);
      expect(thrown!.getResponse()).toMatchObject({
        errorCode: ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      });
    });

    it('deve lançar FORBIDDEN quando membro existe mas está inativo', async () => {
      mockEstablishmentRepository.findById.mockResolvedValue(mockEstablishment);
      mockUserEstablishmentRepository.findByUserAndEstablishment.mockResolvedValue(
        {
          id: 'ue-1',
          userId,
          establishmentId,
          isActive: false,
          role: UserRole.BARBER,
        },
      );

      let thrown: CustomHttpException;
      try {
        await service.execute(userId, establishmentId);
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown!).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.FORBIDDEN);
    });
  });
});
