import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberProductDeleteParamDTO } from '../dtos/member-product-delete-param.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { MemberProductDeleteService } from './member-product-delete.service';
import { MemberProductValidationService } from './member-product-validation.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

describe('MemberProductDeleteService', () => {
  let service: MemberProductDeleteService;

  const requesterId = 'owner-1';
  const memberId = 'member-1';
  const productId = 'product-1';
  const establishmentId = 'est-1';
  const params: MemberProductDeleteParamDTO = { memberId, productId };

  const mockMemberProductRepository = {
    deleteMemberProduct: jest.fn(),
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
        MemberProductDeleteService,
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

    service = module.get<MemberProductDeleteService>(
      MemberProductDeleteService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve chamar validation e soft delete e não lançar', async () => {
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
      mockMemberProductRepository.deleteMemberProduct.mockResolvedValue(
        undefined,
      );

      await service.execute(params, requesterId);

      expect(
        mockUserEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember,
      ).toHaveBeenCalledWith(memberId, requesterId);
      expect(mockMemberProductValidationService.execute).toHaveBeenCalledWith(
        memberId,
        establishmentId,
        productId,
        requesterId,
      );
      expect(
        mockMemberProductRepository.deleteMemberProduct,
      ).toHaveBeenCalledWith(memberProductWithRelations.id, requesterId);
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

      await expect(service.execute(params, requesterId)).rejects.toThrow(
        CustomHttpException,
      );

      expect(
        mockMemberProductRepository.deleteMemberProduct,
      ).not.toHaveBeenCalled();
    });
  });
});
