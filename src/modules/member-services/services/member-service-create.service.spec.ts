import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberServiceCreateParamDTO } from '../dtos/member-service-create-param.dto';
import { MemberServiceCreateRequestDTO } from '../dtos/member-service-create-request.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { MemberServiceCreateService } from './member-service-create.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

describe('MemberServiceCreateService', () => {
  let service: MemberServiceCreateService;

  const requesterId = 'owner-1';
  const memberId = 'member-1';
  const serviceId = 'svc-1';
  const establishmentId = 'est-1';

  const dto: MemberServiceCreateRequestDTO = {
    price: 30,
    commission: 12,
    duration: 30,
  };
  const params: MemberServiceCreateParamDTO = { memberId, serviceId };

  const mockMemberServiceRepository = {
    existsByMemberEstablishmentService: jest.fn(),
    findOneByMemberEstablishmentServiceIncludingDeleted: jest.fn(),
    restoreMemberService: jest.fn(),
    createMemberService: jest.fn(),
  };

  const mockEstablishmentServiceRepository = {
    findByIdWithEstablishment: jest.fn(),
  };

  const mockErrorMessageService = {
    getMessage: jest.fn((code: ErrorCode) => `Message for ${code}`),
  };

  const mockUserEstablishmentValidationService = {
    validateUserAndEstablishment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberServiceCreateService,
        {
          provide: MemberServiceRepository,
          useValue: mockMemberServiceRepository,
        },
        {
          provide: EstablishmentServiceRepository,
          useValue: mockEstablishmentServiceRepository,
        },
        { provide: ErrorMessageService, useValue: mockErrorMessageService },
        {
          provide: UserEstablishmentValidationService,
          useValue: mockUserEstablishmentValidationService,
        },
      ],
    }).compile();

    service = module.get<MemberServiceCreateService>(
      MemberServiceCreateService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve criar novo MemberService e retornar DTO quando serviço existe e não há associação', async () => {
      mockEstablishmentServiceRepository.findByIdWithEstablishment.mockResolvedValue(
        { id: serviceId, establishmentId },
      );
      mockUserEstablishmentValidationService.validateUserAndEstablishment.mockResolvedValue(
        undefined,
      );
      mockMemberServiceRepository.existsByMemberEstablishmentService.mockResolvedValue(
        false,
      );
      mockMemberServiceRepository.findOneByMemberEstablishmentServiceIncludingDeleted.mockResolvedValue(
        null,
      );
      const created = {
        id: 'ms-1',
        userId: memberId,
        establishmentId,
        serviceId,
        price: dto.price,
        duration: dto.duration,
        commission: dto.commission,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockMemberServiceRepository.createMemberService.mockResolvedValue(
        created,
      );

      const result = await service.execute(dto, params, requesterId);

      expect(result).toMatchObject({
        id: created.id,
        memberId: created.userId,
        establishmentId: created.establishmentId,
        serviceId: created.serviceId,
        price: created.price,
        duration: created.duration,
        commission: created.commission,
      });
      expect(
        mockMemberServiceRepository.createMemberService,
      ).toHaveBeenCalledWith({
        memberId,
        establishmentId,
        serviceId,
        price: dto.price,
        commission: dto.commission,
        duration: dto.duration,
      });
      expect(
        mockMemberServiceRepository.restoreMemberService,
      ).not.toHaveBeenCalled();
    });

    it('deve restaurar MemberService soft-deleted quando existir registro deletado', async () => {
      mockEstablishmentServiceRepository.findByIdWithEstablishment.mockResolvedValue(
        { id: serviceId, establishmentId },
      );
      mockUserEstablishmentValidationService.validateUserAndEstablishment.mockResolvedValue(
        undefined,
      );
      mockMemberServiceRepository.existsByMemberEstablishmentService.mockResolvedValue(
        false,
      );
      const softDeletedRecord = { id: 'ms-old', deletedAt: new Date() };
      mockMemberServiceRepository.findOneByMemberEstablishmentServiceIncludingDeleted.mockResolvedValue(
        softDeletedRecord,
      );
      const restored = {
        id: softDeletedRecord.id,
        userId: memberId,
        establishmentId,
        serviceId,
        price: dto.price,
        duration: dto.duration,
        commission: dto.commission,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockMemberServiceRepository.restoreMemberService.mockResolvedValue(
        restored,
      );

      const result = await service.execute(dto, params, requesterId);

      expect(result.id).toBe(restored.id);
      expect(
        mockMemberServiceRepository.restoreMemberService,
      ).toHaveBeenCalledWith(softDeletedRecord.id, {
        price: dto.price,
        commission: dto.commission,
        duration: dto.duration,
      });
      expect(
        mockMemberServiceRepository.createMemberService,
      ).not.toHaveBeenCalled();
    });

    it('deve lançar NOT_FOUND quando serviço do estabelecimento não existe', async () => {
      mockEstablishmentServiceRepository.findByIdWithEstablishment.mockResolvedValue(
        null,
      );
      mockErrorMessageService.getMessage.mockReturnValue(
        'Serviço não encontrado',
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
        errorCode: ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
      });
    });

    it('deve lançar CONFLICT quando associação ativa já existe', async () => {
      mockEstablishmentServiceRepository.findByIdWithEstablishment.mockResolvedValue(
        { id: serviceId, establishmentId },
      );
      mockUserEstablishmentValidationService.validateUserAndEstablishment.mockResolvedValue(
        undefined,
      );
      mockMemberServiceRepository.existsByMemberEstablishmentService.mockResolvedValue(
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
      ).toBe(ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS);
    });

    it('deve propagar exceção quando validateUserAndEstablishment lançar', async () => {
      mockEstablishmentServiceRepository.findByIdWithEstablishment.mockResolvedValue(
        { id: serviceId, establishmentId },
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
        mockMemberServiceRepository.existsByMemberEstablishmentService,
      ).not.toHaveBeenCalled();
    });
  });
});
