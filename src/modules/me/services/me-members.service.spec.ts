import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MeMembersService } from './me-members.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

describe('MeMembersService', () => {
  let service: MeMembersService;

  const userId = 'user-123';
  const establishmentId = 'est-456';

  const mockEstablishmentAccessService = {
    assertUserCanAccessEstablishment: jest.fn(),
  };

  const mockUserEstablishmentRepository = {
    findAllByEstablishmentPaginated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeMembersService,
        {
          provide: EstablishmentAccessService,
          useValue: mockEstablishmentAccessService,
        },
        {
          provide: UserEstablishmentRepository,
          useValue: mockUserEstablishmentRepository,
        },
      ],
    }).compile();

    service = module.get<MeMembersService>(MeMembersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar membros como id/name ordenados por name quando acesso permitido', async () => {
      mockEstablishmentAccessService.assertUserCanAccessEstablishment.mockResolvedValue(
        undefined,
      );
      mockUserEstablishmentRepository.findAllByEstablishmentPaginated.mockResolvedValue(
        {
          data: [
            { user: { id: 'u-2', name: 'Maria' } },
            { user: { id: 'u-1', name: 'João' } },
          ],
        },
      );

      const result = await service.execute(userId, establishmentId);

      expect(result).toEqual([
        { id: 'u-1', name: 'João' },
        { id: 'u-2', name: 'Maria' },
      ]);
      expect(
        mockEstablishmentAccessService.assertUserCanAccessEstablishment,
      ).toHaveBeenCalledWith(userId, establishmentId);
      expect(
        mockUserEstablishmentRepository.findAllByEstablishmentPaginated,
      ).toHaveBeenCalledWith({
        establishmentId,
        skip: 0,
        take: 5000,
      });
    });

    it('deve propagar exceção quando usuário não tem acesso ao estabelecimento', async () => {
      mockEstablishmentAccessService.assertUserCanAccessEstablishment.mockRejectedValue(
        new CustomHttpException(
          'Acesso negado',
          HttpStatus.FORBIDDEN,
          ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        ),
      );

      await expect(service.execute(userId, establishmentId)).rejects.toThrow(
        CustomHttpException,
      );

      expect(
        mockUserEstablishmentRepository.findAllByEstablishmentPaginated,
      ).not.toHaveBeenCalled();
    });
  });
});
