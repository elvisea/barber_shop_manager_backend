import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberProductRepository } from '../repositories/member-product.repository';

import { MemberProductValidationService } from './member-product-validation.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

describe('MemberProductValidationService', () => {
  let service: MemberProductValidationService;

  const memberId = 'member-1';
  const establishmentId = 'est-1';
  const productId = 'product-1';
  const requesterId = 'owner-1';

  const mockMemberProductRepository = {
    findByMemberEstablishmentProductWithRelations: jest.fn(),
  };

  const mockErrorMessageService = {
    getMessage: jest.fn((code: ErrorCode) => `Mensagem para ${code}`),
  };

  const createMemberProductWithRelations = (
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
      id: 'mp-1',
      deletedAt,
      user: hasUser ? { id: memberId } : null,
      product: {
        id: productId,
        establishment: hasEstablishment
          ? { id: establishmentId, ownerId }
          : null,
      },
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberProductValidationService,
        {
          provide: MemberProductRepository,
          useValue: mockMemberProductRepository,
        },
        { provide: ErrorMessageService, useValue: mockErrorMessageService },
      ],
    }).compile();

    service = module.get<MemberProductValidationService>(
      MemberProductValidationService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar MemberProduct com relations quando válido', async () => {
      const withRelations = createMemberProductWithRelations();
      mockMemberProductRepository.findByMemberEstablishmentProductWithRelations.mockResolvedValue(
        withRelations,
      );

      const result = await service.execute(
        memberId,
        establishmentId,
        productId,
        requesterId,
      );

      expect(result).toEqual(withRelations);
      expect(
        mockMemberProductRepository.findByMemberEstablishmentProductWithRelations,
      ).toHaveBeenCalledWith(memberId, establishmentId, productId);
    });

    it('deve lançar NOT_FOUND quando MemberProduct não existe', async () => {
      mockMemberProductRepository.findByMemberEstablishmentProductWithRelations.mockResolvedValue(
        null,
      );
      mockErrorMessageService.getMessage.mockReturnValue('Não encontrado');

      let thrown: CustomHttpException | null = null;
      try {
        await service.execute(
          memberId,
          establishmentId,
          productId,
          requesterId,
        );
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(
        (thrown!.getResponse() as { errorCode: ErrorCode }).errorCode,
      ).toBe(ErrorCode.MEMBER_PRODUCT_NOT_FOUND);
    });

    it('deve lançar NOT_FOUND quando MemberProduct está soft-deleted', async () => {
      const withRelations = createMemberProductWithRelations({
        deletedAt: new Date(),
      });
      mockMemberProductRepository.findByMemberEstablishmentProductWithRelations.mockResolvedValue(
        withRelations,
      );
      mockErrorMessageService.getMessage.mockReturnValue('Não encontrado');

      let thrown: CustomHttpException | null = null;
      try {
        await service.execute(
          memberId,
          establishmentId,
          productId,
          requesterId,
        );
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(
        (thrown!.getResponse() as { errorCode: ErrorCode }).errorCode,
      ).toBe(ErrorCode.MEMBER_PRODUCT_NOT_FOUND);
    });

    it('deve lançar FORBIDDEN quando requester não é dono do estabelecimento', async () => {
      const withRelations = createMemberProductWithRelations({
        ownerId: 'other-owner',
      });
      mockMemberProductRepository.findByMemberEstablishmentProductWithRelations.mockResolvedValue(
        withRelations,
      );
      mockErrorMessageService.getMessage.mockReturnValue('Não é dono');

      let thrown: CustomHttpException | null = null;
      try {
        await service.execute(
          memberId,
          establishmentId,
          productId,
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
      const withRelations = createMemberProductWithRelations({
        hasUser: false,
      });
      mockMemberProductRepository.findByMemberEstablishmentProductWithRelations.mockResolvedValue(
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
          productId,
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
