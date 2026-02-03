import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberServiceUpdateParamDTO } from '../dtos/member-service-update-param.dto';
import { MemberServiceUpdateRequestDTO } from '../dtos/member-service-update-request.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { MemberServiceUpdateService } from './member-service-update.service';
import { MemberServiceValidationService } from './member-service-validation.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

describe('MemberServiceUpdateService', () => {
  let service: MemberServiceUpdateService;

  const requesterId = 'owner-1';
  const memberId = 'member-1';
  const serviceId = 'svc-1';
  const establishmentId = 'est-1';
  const params: MemberServiceUpdateParamDTO = { memberId, serviceId };
  const dto: MemberServiceUpdateRequestDTO = {
    price: 35,
    commission: 14,
    duration: 45,
  };

  const mockMemberServiceRepository = {
    updateMemberService: jest.fn(),
  };

  const mockMemberServiceValidationService = {
    execute: jest.fn(),
  };

  const mockUserEstablishmentValidationService = {
    getEstablishmentIdOwnedByRequesterForMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberServiceUpdateService,
        {
          provide: MemberServiceRepository,
          useValue: mockMemberServiceRepository,
        },
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

    service = module.get<MemberServiceUpdateService>(
      MemberServiceUpdateService,
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
      const memberServiceWithRelations = {
        id: 'ms-1',
        userId: memberId,
        establishmentId,
        serviceId,
      };
      mockMemberServiceValidationService.execute.mockResolvedValue(
        memberServiceWithRelations,
      );
      const updated = {
        id: memberServiceWithRelations.id,
        userId: memberId,
        establishmentId,
        serviceId,
        price: dto.price,
        duration: dto.duration,
        commission: dto.commission,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockMemberServiceRepository.updateMemberService.mockResolvedValue(
        updated,
      );

      const result = await service.execute(dto, params, requesterId);

      expect(result).toMatchObject({
        id: updated.id,
        memberId: memberId,
        establishmentId,
        serviceId,
        price: dto.price,
        duration: dto.duration,
        commission: dto.commission,
      });
      expect(
        mockMemberServiceRepository.updateMemberService,
      ).toHaveBeenCalledWith(memberServiceWithRelations.id, {
        price: dto.price,
        commission: dto.commission,
        duration: dto.duration,
      });
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

      await expect(service.execute(dto, params, requesterId)).rejects.toThrow(
        CustomHttpException,
      );

      expect(
        mockMemberServiceRepository.updateMemberService,
      ).not.toHaveBeenCalled();
    });
  });
});
