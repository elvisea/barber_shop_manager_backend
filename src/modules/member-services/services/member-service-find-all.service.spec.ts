import { Test, TestingModule } from '@nestjs/testing';

import { MemberServiceFindAllParamDTO } from '../dtos/member-service-find-all-param.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { MemberServiceFindAllService } from './member-service-find-all.service';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

describe('MemberServiceFindAllService', () => {
  let service: MemberServiceFindAllService;

  const requesterId = 'owner-1';
  const memberId = 'member-1';
  const establishmentId = 'est-1';
  const params: MemberServiceFindAllParamDTO = { memberId };
  const query: BasePaginationQueryDTO = { page: 1, limit: 10 };

  const mockMemberServiceRepository = {
    findAllByMemberPaginated: jest.fn(),
  };

  const mockUserEstablishmentValidationService = {
    getEstablishmentIdOwnedByRequesterForMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberServiceFindAllService,
        {
          provide: MemberServiceRepository,
          useValue: mockMemberServiceRepository,
        },
        {
          provide: UserEstablishmentValidationService,
          useValue: mockUserEstablishmentValidationService,
        },
      ],
    }).compile();

    service = module.get<MemberServiceFindAllService>(
      MemberServiceFindAllService,
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
          id: 'ms-1',
          serviceId: 'svc-1',
          price: 30,
          duration: 30,
          commission: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          service: {
            id: 'svc-1',
            name: 'Corte',
            description: null,
          },
        },
      ];
      mockMemberServiceRepository.findAllByMemberPaginated.mockResolvedValue({
        data,
        total: 1,
      });

      const result = await service.execute(params, query, requesterId);

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: 'svc-1',
        name: 'Corte',
        price: 30,
        duration: 30,
        commission: 12,
      });
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.itemsPerPage).toBe(10);
      expect(result.meta.totalItems).toBe(1);
      expect(
        mockMemberServiceRepository.findAllByMemberPaginated,
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
        mockMemberServiceRepository.findAllByMemberPaginated,
      ).not.toHaveBeenCalled();
    });
  });
});
