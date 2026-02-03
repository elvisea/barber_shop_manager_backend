import { Test, TestingModule } from '@nestjs/testing';

import { MemberProductFindAllParamDTO } from '../dtos/member-product-find-all-param.dto';
import { MemberProductRepository } from '../repositories/member-product.repository';

import { MemberProductFindAllService } from './member-product-find-all.service';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

describe('MemberProductFindAllService', () => {
  let service: MemberProductFindAllService;

  const requesterId = 'owner-1';
  const memberId = 'member-1';
  const establishmentId = 'est-1';
  const params: MemberProductFindAllParamDTO = { memberId };
  const query: BasePaginationQueryDTO = { page: 1, limit: 10 };

  const mockMemberProductRepository = {
    findAllByMemberPaginated: jest.fn(),
  };

  const mockUserEstablishmentValidationService = {
    getEstablishmentIdOwnedByRequesterForMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberProductFindAllService,
        {
          provide: MemberProductRepository,
          useValue: mockMemberProductRepository,
        },
        {
          provide: UserEstablishmentValidationService,
          useValue: mockUserEstablishmentValidationService,
        },
      ],
    }).compile();

    service = module.get<MemberProductFindAllService>(
      MemberProductFindAllService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar DTO paginado quando requester é dono', async () => {
      mockUserEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember.mockResolvedValue(
        establishmentId,
      );
      const data = [
        {
          id: 'mp-1',
          productId: 'p-1',
          price: 25,
          commission: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          product: {
            id: 'p-1',
            name: 'Cera',
            description: null,
          },
        },
      ];
      mockMemberProductRepository.findAllByMemberPaginated.mockResolvedValue({
        data,
        total: 1,
      });

      const result = await service.execute(params, query, requesterId);

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: 'p-1',
        name: 'Cera',
        price: 25,
        commission: 10,
      });
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.itemsPerPage).toBe(10);
      expect(result.meta.totalItems).toBe(1);
      expect(
        mockMemberProductRepository.findAllByMemberPaginated,
      ).toHaveBeenCalledWith({
        establishmentId,
        memberId,
        skip: 0,
        take: 10,
      });
    });

    it('deve propagar exceção quando getEstablishmentIdOwnedByRequesterForMember lançar', async () => {
      mockUserEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember.mockRejectedValue(
        new CustomHttpException(
          'Não é dono',
          403,
          'ESTABLISHMENT_NOT_OWNED_BY_USER' as never,
        ),
      );

      await expect(service.execute(params, query, requesterId)).rejects.toThrow(
        CustomHttpException,
      );

      expect(
        mockMemberProductRepository.findAllByMemberPaginated,
      ).not.toHaveBeenCalled();
    });
  });
});
