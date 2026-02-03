import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MeServicesService } from './me-services.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

describe('MeServicesService', () => {
  let service: MeServicesService;

  const userId = 'user-123';
  const establishmentId = 'est-456';

  const mockEstablishmentAccessService = {
    assertUserCanAccessEstablishment: jest.fn(),
  };

  const mockEstablishmentServiceRepository = {
    findAllByEstablishmentPaginated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeServicesService,
        {
          provide: EstablishmentAccessService,
          useValue: mockEstablishmentAccessService,
        },
        {
          provide: EstablishmentServiceRepository,
          useValue: mockEstablishmentServiceRepository,
        },
      ],
    }).compile();

    service = module.get<MeServicesService>(MeServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar serviços como id/name ordenados por name quando acesso permitido', async () => {
      mockEstablishmentAccessService.assertUserCanAccessEstablishment.mockResolvedValue(
        undefined,
      );
      mockEstablishmentServiceRepository.findAllByEstablishmentPaginated.mockResolvedValue(
        {
          data: [
            { id: 's-2', name: 'Barba' },
            { id: 's-1', name: 'Cabelo' },
          ],
        },
      );

      const result = await service.execute(userId, establishmentId);

      expect(result).toEqual([
        { id: 's-2', name: 'Barba' },
        { id: 's-1', name: 'Cabelo' },
      ]);
      expect(
        mockEstablishmentAccessService.assertUserCanAccessEstablishment,
      ).toHaveBeenCalledWith(userId, establishmentId);
      expect(
        mockEstablishmentServiceRepository.findAllByEstablishmentPaginated,
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
        mockEstablishmentServiceRepository.findAllByEstablishmentPaginated,
      ).not.toHaveBeenCalled();
    });
  });
});
