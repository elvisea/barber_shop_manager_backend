import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberProductFindOneParamDTO } from '../dtos/member-product-find-one-param.dto';

import { MemberProductFindOneService } from './member-product-find-one.service';
import { MemberProductValidationService } from './member-product-validation.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

describe('MemberProductFindOneService', () => {
  let service: MemberProductFindOneService;

  const requesterId = 'owner-1';
  const memberId = 'member-1';
  const productId = 'product-1';
  const establishmentId = 'est-1';
  const params: MemberProductFindOneParamDTO = { memberId, productId };

  const mockMemberProductValidationService = {
    execute: jest.fn(),
  };

  const mockUserEstablishmentValidationService = {
    getEstablishmentIdOwnedByRequesterForMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberProductFindOneService,
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

    service = module.get<MemberProductFindOneService>(
      MemberProductFindOneService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar DTO quando MemberProduct existe e requester é dono', async () => {
      mockUserEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember.mockResolvedValue(
        establishmentId,
      );
      const memberProductWithRelations = {
        id: 'mp-1',
        product: {
          id: productId,
          name: 'Cera',
          description: 'Desc',
        },
        price: 25,
        commission: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockMemberProductValidationService.execute.mockResolvedValue(
        memberProductWithRelations,
      );

      const result = await service.execute(params, requesterId);

      expect(result).toMatchObject({
        id: productId,
        name: 'Cera',
        description: 'Desc',
        price: 25,
        commission: 10,
      });
      expect(mockMemberProductValidationService.execute).toHaveBeenCalledWith(
        memberId,
        establishmentId,
        productId,
        requesterId,
      );
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
    });
  });
});
