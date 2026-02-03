import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberServiceDeleteParamDTO } from '../dtos/member-service-delete-param.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { MemberServiceDeleteService } from './member-service-delete.service';
import { MemberServiceValidationService } from './member-service-validation.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

describe('MemberServiceDeleteService', () => {
  let service: MemberServiceDeleteService;

  const requesterId = 'owner-1';
  const memberId = 'member-1';
  const serviceId = 'svc-1';
  const establishmentId = 'est-1';
  const params: MemberServiceDeleteParamDTO = { memberId, serviceId };

  const mockMemberServiceRepository = {
    deleteMemberService: jest.fn(),
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
        MemberServiceDeleteService,
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

    service = module.get<MemberServiceDeleteService>(
      MemberServiceDeleteService,
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
      const memberServiceWithRelations = {
        id: 'ms-1',
        userId: memberId,
        establishmentId,
        serviceId,
      };
      mockMemberServiceValidationService.execute.mockResolvedValue(
        memberServiceWithRelations,
      );
      mockMemberServiceRepository.deleteMemberService.mockResolvedValue(
        undefined,
      );

      await service.execute(params, requesterId);

      expect(
        mockUserEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember,
      ).toHaveBeenCalledWith(memberId, requesterId);
      expect(mockMemberServiceValidationService.execute).toHaveBeenCalledWith(
        memberId,
        establishmentId,
        serviceId,
        requesterId,
      );
      expect(
        mockMemberServiceRepository.deleteMemberService,
      ).toHaveBeenCalledWith(memberServiceWithRelations.id, requesterId);
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

      expect(
        mockMemberServiceRepository.deleteMemberService,
      ).not.toHaveBeenCalled();
    });
  });
});
