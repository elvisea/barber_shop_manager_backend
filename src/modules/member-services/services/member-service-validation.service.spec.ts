import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberServiceRepository } from '../repositories/member-service.repository';

import { MemberServiceValidationService } from './member-service-validation.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

describe('MemberServiceValidationService', () => {
  let service: MemberServiceValidationService;

  const memberId = 'member-1';
  const establishmentId = 'est-1';
  const serviceId = 'svc-1';
  const requesterId = 'owner-1';

  const mockMemberServiceRepository = {
    findByMemberEstablishmentServiceWithRelations: jest.fn(),
  };

  const mockErrorMessageService = {
    getMessage: jest.fn((code: ErrorCode) => `Mensagem para ${code}`),
  };

  const createMemberServiceWithRelations = (
    overrides: {
      deletedAt?: Date | null;
      ownerId?: string;
      hasUser?: boolean;
      hasEstablishment?: boolean;
    } = {},
  ) => {
    const {
      deletedAt = null,
      ownerId = requesterId,
      hasUser = true,
      hasEstablishment = true,
    } = overrides;
    return {
      id: 'ms-1',
      deletedAt,
      user: hasUser ? { id: memberId } : null,
      service: {
        id: serviceId,
        establishment: hasEstablishment
          ? { id: establishmentId, ownerId }
          : null,
      },
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberServiceValidationService,
        {
          provide: MemberServiceRepository,
          useValue: mockMemberServiceRepository,
        },
        { provide: ErrorMessageService, useValue: mockErrorMessageService },
      ],
    }).compile();

    service = module.get<MemberServiceValidationService>(
      MemberServiceValidationService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar MemberService com relations quando válido', async () => {
      const withRelations = createMemberServiceWithRelations();
      mockMemberServiceRepository.findByMemberEstablishmentServiceWithRelations.mockResolvedValue(
        withRelations,
      );

      const result = await service.execute(
        memberId,
        establishmentId,
        serviceId,
        requesterId,
      );

      expect(result).toEqual(withRelations);
      expect(
        mockMemberServiceRepository.findByMemberEstablishmentServiceWithRelations,
      ).toHaveBeenCalledWith(memberId, establishmentId, serviceId);
    });

    it('deve lançar NOT_FOUND quando MemberService não existe', async () => {
      mockMemberServiceRepository.findByMemberEstablishmentServiceWithRelations.mockResolvedValue(
        null,
      );
      mockErrorMessageService.getMessage.mockReturnValue('Não encontrado');

      let thrown: CustomHttpException | null = null;
      try {
        await service.execute(
          memberId,
          establishmentId,
          serviceId,
          requesterId,
        );
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(
        (thrown!.getResponse() as { errorCode: ErrorCode }).errorCode,
      ).toBe(ErrorCode.MEMBER_SERVICE_NOT_FOUND);
    });

    it('deve lançar NOT_FOUND quando MemberService está soft-deleted', async () => {
      const withRelations = createMemberServiceWithRelations({
        deletedAt: new Date(),
      });
      mockMemberServiceRepository.findByMemberEstablishmentServiceWithRelations.mockResolvedValue(
        withRelations,
      );
      mockErrorMessageService.getMessage.mockReturnValue('Não encontrado');

      let thrown: CustomHttpException | null = null;
      try {
        await service.execute(
          memberId,
          establishmentId,
          serviceId,
          requesterId,
        );
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(
        (thrown!.getResponse() as { errorCode: ErrorCode }).errorCode,
      ).toBe(ErrorCode.MEMBER_SERVICE_NOT_FOUND);
    });

    it('deve lançar FORBIDDEN quando requester não é dono do estabelecimento', async () => {
      const withRelations = createMemberServiceWithRelations({
        ownerId: 'other-owner',
      });
      mockMemberServiceRepository.findByMemberEstablishmentServiceWithRelations.mockResolvedValue(
        withRelations,
      );
      mockErrorMessageService.getMessage.mockReturnValue('Não é dono');

      let thrown: CustomHttpException | null = null;
      try {
        await service.execute(
          memberId,
          establishmentId,
          serviceId,
          requesterId,
        );
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.FORBIDDEN);
      expect(
        (thrown!.getResponse() as { errorCode: ErrorCode }).errorCode,
      ).toBe(ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER);
    });

    it('deve lançar NOT_FOUND quando user não existe', async () => {
      const withRelations = createMemberServiceWithRelations({
        hasUser: false,
      });
      mockMemberServiceRepository.findByMemberEstablishmentServiceWithRelations.mockResolvedValue(
        withRelations,
      );
      mockErrorMessageService.getMessage.mockReturnValue(
        'Membro não encontrado',
      );

      let thrown: CustomHttpException | null = null;
      try {
        await service.execute(
          memberId,
          establishmentId,
          serviceId,
          requesterId,
        );
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(
        (thrown!.getResponse() as { errorCode: ErrorCode }).errorCode,
      ).toBe(ErrorCode.MEMBER_NOT_FOUND);
    });
  });
});
