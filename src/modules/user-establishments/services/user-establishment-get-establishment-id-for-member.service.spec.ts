import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserEstablishmentGetEstablishmentIdForMemberService } from './user-establishment-get-establishment-id-for-member.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

describe('UserEstablishmentGetEstablishmentIdForMemberService', () => {
  let service: UserEstablishmentGetEstablishmentIdForMemberService;

  const memberId = 'member-123';
  const requesterId = 'owner-456';
  const establishmentId = 'est-789';

  const mockUserEstablishmentRepository = {
    findAllByUserWithRelations: jest.fn(),
  };

  const mockErrorMessageService = {
    getMessage: jest.fn((code: ErrorCode) => `Mock message for ${code}`),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserEstablishmentGetEstablishmentIdForMemberService,
        {
          provide: UserEstablishmentRepository,
          useValue: mockUserEstablishmentRepository,
        },
        {
          provide: ErrorMessageService,
          useValue: mockErrorMessageService,
        },
      ],
    }).compile();

    service = module.get<UserEstablishmentGetEstablishmentIdForMemberService>(
      UserEstablishmentGetEstablishmentIdForMemberService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar establishmentId quando requester é dono e membro pertence', async () => {
      const userEstablishments = [
        {
          id: 'ue-1',
          establishmentId,
          establishment: { id: establishmentId, ownerId: requesterId },
        },
      ];
      mockUserEstablishmentRepository.findAllByUserWithRelations.mockResolvedValue(
        userEstablishments,
      );

      const result = await service.execute(memberId, requesterId);

      expect(result).toBe(establishmentId);
      expect(
        mockUserEstablishmentRepository.findAllByUserWithRelations,
      ).toHaveBeenCalledWith(memberId);
    });

    it('deve lançar NOT_FOUND quando membro não pertence a nenhum estabelecimento', async () => {
      mockUserEstablishmentRepository.findAllByUserWithRelations.mockResolvedValue(
        [],
      );

      let thrown: CustomHttpException;
      try {
        await service.execute(memberId, requesterId);
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown!).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(thrown!.getResponse()).toMatchObject({
        errorCode: ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      });
    });

    it('deve lançar FORBIDDEN quando requester não é dono de nenhum estabelecimento do membro', async () => {
      const userEstablishments = [
        {
          id: 'ue-1',
          establishmentId: 'outro-est',
          establishment: { id: 'outro-est', ownerId: 'outro-dono' },
        },
      ];
      mockUserEstablishmentRepository.findAllByUserWithRelations.mockResolvedValue(
        userEstablishments,
      );

      let thrown: CustomHttpException;
      try {
        await service.execute(memberId, requesterId);
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown!).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.FORBIDDEN);
      expect(thrown!.getResponse()).toMatchObject({
        errorCode: ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      });
    });
  });
});
