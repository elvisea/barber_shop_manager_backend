import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberProductCreateParamDTO } from '../dtos/member-product-create-param.dto';
import { MemberProductCreateRequestDTO } from '../dtos/member-product-create-request.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { MemberProductCreateService } from './member-product-create.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentProductRepository } from '@/modules/establishment-products/repositories/establishment-product.repository';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

describe('MemberProductCreateService', () => {
  let service: MemberProductCreateService;

  const requesterId = 'owner-1';
  const memberId = 'member-1';
  const productId = 'product-1';
  const establishmentId = 'est-1';

  const dto: MemberProductCreateRequestDTO = {
    price: 25,
    commission: 10,
  };
  const params: MemberProductCreateParamDTO = { memberId, productId };

  const mockMemberProductRepository = {
    existsByMemberEstablishmentProduct: jest.fn(),
    findOneByMemberEstablishmentProductIncludingDeleted: jest.fn(),
    restoreMemberProduct: jest.fn(),
    createMemberProduct: jest.fn(),
  };

  const mockEstablishmentProductRepository = {
    findByIdWithEstablishment: jest.fn(),
  };

  const mockErrorMessageService = {
    getMessage: jest.fn((code: ErrorCode) => `Mensagem para ${code}`),
  };

  const mockUserEstablishmentValidationService = {
    validateUserAndEstablishment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberProductCreateService,
        {
          provide: MemberProductRepository,
          useValue: mockMemberProductRepository,
        },
        {
          provide: EstablishmentProductRepository,
          useValue: mockEstablishmentProductRepository,
        },
        { provide: ErrorMessageService, useValue: mockErrorMessageService },
        {
          provide: UserEstablishmentValidationService,
          useValue: mockUserEstablishmentValidationService,
        },
      ],
    }).compile();

    service = module.get<MemberProductCreateService>(
      MemberProductCreateService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve criar novo MemberProduct e retornar DTO quando produto existe e não há associação', async () => {
      mockEstablishmentProductRepository.findByIdWithEstablishment.mockResolvedValue(
        { id: productId, establishmentId },
      );
      mockUserEstablishmentValidationService.validateUserAndEstablishment.mockResolvedValue(
        undefined,
      );
      mockMemberProductRepository.existsByMemberEstablishmentProduct.mockResolvedValue(
        false,
      );
      mockMemberProductRepository.findOneByMemberEstablishmentProductIncludingDeleted.mockResolvedValue(
        null,
      );
      const created = {
        id: 'mp-1',
        userId: memberId,
        establishmentId,
        productId,
        price: dto.price,
        commission: dto.commission,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockMemberProductRepository.createMemberProduct.mockResolvedValue(
        created,
      );

      const result = await service.execute(dto, params, requesterId);

      expect(result).toMatchObject({
        id: created.id,
        memberId: created.userId,
        establishmentId: created.establishmentId,
        productId: created.productId,
        price: created.price,
        commission: created.commission,
      });
      expect(
        mockMemberProductRepository.createMemberProduct,
      ).toHaveBeenCalledWith({
        memberId,
        establishmentId,
        productId,
        price: dto.price,
        commission: dto.commission,
      });
      expect(
        mockMemberProductRepository.restoreMemberProduct,
      ).not.toHaveBeenCalled();
    });

    it('deve restaurar MemberProduct soft-deleted quando existir registro deletado', async () => {
      mockEstablishmentProductRepository.findByIdWithEstablishment.mockResolvedValue(
        { id: productId, establishmentId },
      );
      mockUserEstablishmentValidationService.validateUserAndEstablishment.mockResolvedValue(
        undefined,
      );
      mockMemberProductRepository.existsByMemberEstablishmentProduct.mockResolvedValue(
        false,
      );
      const softDeletedRecord = {
        id: 'mp-old',
        deletedAt: new Date(),
      };
      mockMemberProductRepository.findOneByMemberEstablishmentProductIncludingDeleted.mockResolvedValue(
        softDeletedRecord,
      );
      const restored = {
        id: softDeletedRecord.id,
        userId: memberId,
        establishmentId,
        productId,
        price: dto.price,
        commission: dto.commission,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockMemberProductRepository.restoreMemberProduct.mockResolvedValue(
        restored,
      );

      const result = await service.execute(dto, params, requesterId);

      expect(result.id).toBe(restored.id);
      expect(
        mockMemberProductRepository.restoreMemberProduct,
      ).toHaveBeenCalledWith(softDeletedRecord.id, {
        price: dto.price,
        commission: dto.commission,
      });
      expect(
        mockMemberProductRepository.createMemberProduct,
      ).not.toHaveBeenCalled();
    });

    it('deve lançar NOT_FOUND quando produto do estabelecimento não existe', async () => {
      mockEstablishmentProductRepository.findByIdWithEstablishment.mockResolvedValue(
        null,
      );
      mockErrorMessageService.getMessage.mockReturnValue(
        'Produto não encontrado',
      );

      let thrown: CustomHttpException | null = null;
      try {
        await service.execute(dto, params, requesterId);
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(thrown!.getResponse()).toMatchObject({
        errorCode: ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND,
      });
    });

    it('deve lançar CONFLICT quando associação ativa já existe', async () => {
      mockEstablishmentProductRepository.findByIdWithEstablishment.mockResolvedValue(
        { id: productId, establishmentId },
      );
      mockUserEstablishmentValidationService.validateUserAndEstablishment.mockResolvedValue(
        undefined,
      );
      mockMemberProductRepository.existsByMemberEstablishmentProduct.mockResolvedValue(
        true,
      );
      mockErrorMessageService.getMessage.mockReturnValue('Já existe');

      let thrown: CustomHttpException | null = null;
      try {
        await service.execute(dto, params, requesterId);
      } catch (e) {
        thrown = e as CustomHttpException;
      }
      expect(thrown).toBeInstanceOf(CustomHttpException);
      expect(thrown!.getStatus()).toBe(HttpStatus.CONFLICT);
      expect(
        (thrown!.getResponse() as { errorCode: ErrorCode }).errorCode,
      ).toBe(ErrorCode.MEMBER_PRODUCT_ALREADY_EXISTS);
    });

    it('deve propagar exceção quando validateUserAndEstablishment lançar', async () => {
      mockEstablishmentProductRepository.findByIdWithEstablishment.mockResolvedValue(
        { id: productId, establishmentId },
      );
      mockUserEstablishmentValidationService.validateUserAndEstablishment.mockRejectedValue(
        new CustomHttpException(
          'Não é dono',
          HttpStatus.FORBIDDEN,
          ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        ),
      );

      await expect(service.execute(dto, params, requesterId)).rejects.toThrow(
        CustomHttpException,
      );

      expect(
        mockMemberProductRepository.existsByMemberEstablishmentProduct,
      ).not.toHaveBeenCalled();
    });
  });
});
