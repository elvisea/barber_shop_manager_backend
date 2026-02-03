import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MeProductsService } from './me-products.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { EstablishmentProductRepository } from '@/modules/establishment-products/repositories/establishment-product.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

describe('MeProductsService', () => {
  let service: MeProductsService;

  const userId = 'user-123';
  const establishmentId = 'est-456';

  const mockEstablishmentAccessService = {
    assertUserCanAccessEstablishment: jest.fn(),
  };

  const mockEstablishmentProductRepository = {
    findAllByEstablishmentPaginated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeProductsService,
        {
          provide: EstablishmentAccessService,
          useValue: mockEstablishmentAccessService,
        },
        {
          provide: EstablishmentProductRepository,
          useValue: mockEstablishmentProductRepository,
        },
      ],
    }).compile();

    service = module.get<MeProductsService>(MeProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar produtos como id/name ordenados por name quando acesso permitido', async () => {
      mockEstablishmentAccessService.assertUserCanAccessEstablishment.mockResolvedValue(
        undefined,
      );
      mockEstablishmentProductRepository.findAllByEstablishmentPaginated.mockResolvedValue(
        {
          data: [
            { id: 'p-2', name: 'Gel' },
            { id: 'p-1', name: 'Cera' },
          ],
        },
      );

      const result = await service.execute(userId, establishmentId);

      expect(result).toEqual([
        { id: 'p-1', name: 'Cera' },
        { id: 'p-2', name: 'Gel' },
      ]);
      expect(
        mockEstablishmentAccessService.assertUserCanAccessEstablishment,
      ).toHaveBeenCalledWith(userId, establishmentId);
      expect(
        mockEstablishmentProductRepository.findAllByEstablishmentPaginated,
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
        mockEstablishmentProductRepository.findAllByEstablishmentPaginated,
      ).not.toHaveBeenCalled();
    });
  });
});
