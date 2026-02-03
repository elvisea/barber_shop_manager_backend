import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberProductUpdateParamDTO } from '../dtos/member-product-update-param.dto';
import { MemberProductUpdateRequestDTO } from '../dtos/member-product-update-request.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { MemberProductUpdateService } from './member-product-update.service';
import { MemberProductValidationService } from './member-product-validation.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

describe('MemberProductUpdateService', () => {
  let service: MemberProductUpdateService;

  const requesterId = 'owner-1';
  const memberId = 'member-1';
  const productId = 'product-1';
  const establishmentId = 'est-1';
  const params: MemberProductUpdateParamDTO = { memberId, productId };
  const dto: MemberProductUpdateRequestDTO = { price: 30, commission: 15 };

  const mockMemberProductRepository = {
    updateMemberProduct: jest.fn(),
  };

  const mockMemberProductValidationService = {
    execute: jest.fn(),
  };

  const mockUserEstablishmentValidationService = {
    getEstablishmentIdOwnedByRequesterForMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberProductUpdateService,
        {
          provide: MemberProductRepository,
          useValue: mockMemberProductRepository,
        },
        {
          provide: MemberProductValidationService,
          useValue: mockMemberProductValidationService,
        },
        {
          provide: UserEstablishmentValidationService,
          useValue: mockUserEstablishmentValidationService,
        },
      ],
    }).compile();

    service = module.get<MemberProductUpdateService>(
      MemberProductUpdateService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve atualizar e retornar DTO quando validation ok', async () => {
      mockUserEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember.mockResolvedValue(
        establishmentId,
      );
      const memberProductWithRelations = {
        id: 'mp-1',
        userId: memberId,
        establishmentId,
        productId,
      };
      mockMemberProductValidationService.execute.mockResolvedValue(
        memberProductWithRelations,
      );
      const updated = {
        id: memberProductWithRelations.id,
        userId: memberId,
        establishmentId,
        productId,
        price: dto.price,
        commission: dto.commission,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockMemberProductRepository.updateMemberProduct.mockResolvedValue(
        updated,
      );

      const result = await service.execute(dto, params, requesterId);

      expect(result).toMatchObject({
        id: updated.id,
        memberId: memberId,
        establishmentId,
        productId,
        price: dto.price,
        commission: dto.commission,
      });
      expect(
        mockMemberProductRepository.updateMemberProduct,
      ).toHaveBeenCalledWith(memberProductWithRelations.id, {
        price: dto.price,
        commission: dto.commission,
      });
    });

    it('deve propagar exceção quando validation lançar', async () => {
      mockUserEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember.mockResolvedValue(
        establishmentId,
      );
      mockMemberProductValidationService.execute.mockRejectedValue(
        new CustomHttpException(
          'Não encontrado',
          HttpStatus.NOT_FOUND,
          ErrorCode.MEMBER_PRODUCT_NOT_FOUND,
        ),
      );

      await expect(service.execute(dto, params, requesterId)).rejects.toThrow(
        CustomHttpException,
      );

      expect(
        mockMemberProductRepository.updateMemberProduct,
      ).not.toHaveBeenCalled();
    });
  });
});
