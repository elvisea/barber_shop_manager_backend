import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberServiceFindOneParamDTO } from '../dtos/member-service-find-one-param.dto';

import { MemberServiceFindOneService } from './member-service-find-one.service';
import { MemberServiceValidationService } from './member-service-validation.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

describe('MemberServiceFindOneService', () => {
  let service: MemberServiceFindOneService;

  const requesterId = 'owner-1';
  const memberId = 'member-1';
  const serviceId = 'svc-1';
  const establishmentId = 'est-1';
  const params: MemberServiceFindOneParamDTO = { memberId, serviceId };

  const mockMemberServiceValidationService = {
    execute: jest.fn(),
  };

  const mockUserEstablishmentValidationService = {
    getEstablishmentIdOwnedByRequesterForMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberServiceFindOneService,
        {
          provide: MemberServiceValidationService,
          useValue: mockMemberServiceValidationService,
        },
        {
          provide: UserEstablishmentValidationService,
          useValue: mockUserEstablishmentValidationService,
        },
      ],
    }).compile();

    service = module.get<MemberServiceFindOneService>(
      MemberServiceFindOneService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar DTO quando MemberService existe e requester é dono', async () => {
      mockUserEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember.mockResolvedValue(
        establishmentId,
      );
      const memberServiceWithRelations = {
        id: 'ms-1',
        service: {
          id: serviceId,
          name: 'Corte',
          description: 'Desc',
        },
        price: 30,
        duration: 30,
        commission: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockMemberServiceValidationService.execute.mockResolvedValue(
        memberServiceWithRelations,
      );

      const result = await service.execute(params, requesterId);

      expect(result).toMatchObject({
        id: serviceId,
        name: 'Corte',
        description: 'Desc',
        price: 30,
        duration: 30,
        commission: 12,
      });
      expect(mockMemberServiceValidationService.execute).toHaveBeenCalledWith(
        memberId,
        establishmentId,
        serviceId,
        requesterId,
      );
    });

    it('deve propagar exceção quando validation lançar', async () => {
      mockUserEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember.mockResolvedValue(
        establishmentId,
      );
      mockMemberServiceValidationService.execute.mockRejectedValue(
        new CustomHttpException(
          'Não encontrado',
          HttpStatus.NOT_FOUND,
          ErrorCode.MEMBER_SERVICE_NOT_FOUND,
        ),
      );

      await expect(service.execute(params, requesterId)).rejects.toThrow(
        CustomHttpException,
      );
    });
  });
});
