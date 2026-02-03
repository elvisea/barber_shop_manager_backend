import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserEstablishmentValidateOwnerAndMemberService } from './user-establishment-validate-owner-and-member.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

describe('UserEstablishmentValidateOwnerAndMemberService', () => {
  let service: UserEstablishmentValidateOwnerAndMemberService;

  const userId = 'member-123';
  const establishmentId = 'est-456';
  const requesterId = 'owner-789';

  const mockOwner = {
    id: requesterId,
    email: 'owner@test.com',
    name: 'Owner',
    phone: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    emailVerified: true,
    password: 'hashed',
  };

  const mockMember = {
    id: userId,
    email: 'member@test.com',
    name: 'Member',
    phone: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    emailVerified: true,
    password: 'hashed',
  };

  const mockEstablishmentWithOwner = {
    id: establishmentId,
    ownerId: requesterId,
    name: 'Barbearia',
    phone: '+5511999999999',
    address: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    deletedBy: null,
    owner: mockOwner,
  };

  const mockEstablishmentRepository = {
    findByIdWithOwner: jest.fn(),
  };

  const mockUserEstablishmentRepository = {
    findByUserAndEstablishmentWithRelations: jest.fn(),
  };

  const mockErrorMessageService = {
    getMessage: jest.fn((code: ErrorCode) => `Mock message for ${code}`),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserEstablishmentValidateOwnerAndMemberService,
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

    service = module.get<UserEstablishmentValidateOwnerAndMemberService>(
      UserEstablishmentValidateOwnerAndMemberService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar establishment e owner quando userId é o próprio requester (dono)', async () => {
      mockEstablishmentRepository.findByIdWithOwner.mockResolvedValue(
        mockEstablishmentWithOwner,
      );

      const result = await service.execute(
        requesterId,
        establishmentId,
        requesterId,
      );

      expect(result.establishment).toEqual(mockEstablishmentWithOwner);
      expect(result.member).toEqual(mockOwner);
      expect(
        mockUserEstablishmentRepository.findByUserAndEstablishmentWithRelations,
      ).not.toHaveBeenCalled();
    });

    it('deve retornar establishment e member quando membro ativo pertence ao estabelecimento', async () => {
      mockEstablishmentRepository.findByIdWithOwner.mockResolvedValue(
        mockEstablishmentWithOwner,
      );
      mockUserEstablishmentRepository.findByUserAndEstablishmentWithRelations.mockResolvedValue(
        {
          id: 'ue-1',
          userId,
          establishmentId,
          isActive: true,
          user: mockMember,
          establishment: mockEstablishmentWithOwner,
        },
      );

      const result = await service.execute(
        userId,
        establishmentId,
        requesterId,
      );

      expect(result.establishment).toEqual(mockEstablishmentWithOwner);
      expect(result.member).toEqual(mockMember);
      expect(
        mockUserEstablishmentRepository.findByUserAndEstablishmentWithRelations,
      ).toHaveBeenCalledWith(userId, establishmentId);
    });

    it('deve lançar NOT_FOUND quando estabelecimento não existe', async () => {
      mockEstablishmentRepository.findByIdWithOwner.mockResolvedValue(null);

      let thrown: CustomHttpException;
      try {
        await service.execute(userId, establishmentId, requesterId);
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown!).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(thrown!.getResponse()).toMatchObject({
        errorCode: ErrorCode.ESTABLISHMENT_NOT_FOUND,
      });
    });

    it('deve lançar FORBIDDEN quando requester não é dono do estabelecimento', async () => {
      mockEstablishmentRepository.findByIdWithOwner.mockResolvedValue({
        ...mockEstablishmentWithOwner,
        ownerId: 'outro-dono',
      });

      let thrown: CustomHttpException;
      try {
        await service.execute(userId, establishmentId, requesterId);
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown!).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.FORBIDDEN);
      expect(thrown!.getResponse()).toMatchObject({
        errorCode: ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      });
    });

    it('deve lançar NOT_FOUND quando membro não pertence ou está inativo', async () => {
      mockEstablishmentRepository.findByIdWithOwner.mockResolvedValue(
        mockEstablishmentWithOwner,
      );
      mockUserEstablishmentRepository.findByUserAndEstablishmentWithRelations.mockResolvedValue(
        null,
      );

      let thrown: CustomHttpException;
      try {
        await service.execute(userId, establishmentId, requesterId);
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown!).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(thrown!.getResponse()).toMatchObject({
        errorCode: ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      });
    });
  });
});
