import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MeCustomersService } from './me-customers.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { EstablishmentCustomerRepository } from '@/modules/establishment-customers/repositories/establishment-customer.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

describe('MeCustomersService', () => {
  let service: MeCustomersService;

  const userId = 'user-123';
  const establishmentId = 'est-456';

  const mockEstablishmentAccessService = {
    assertUserCanAccessEstablishment: jest.fn(),
  };

  const mockEstablishmentCustomerRepository = {
    findAllByEstablishmentPaginated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeCustomersService,
        {
          provide: EstablishmentAccessService,
          useValue: mockEstablishmentAccessService,
        },
        {
          provide: EstablishmentCustomerRepository,
          useValue: mockEstablishmentCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<MeCustomersService>(MeCustomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar clientes ordenados por name quando acesso permitido', async () => {
      mockEstablishmentAccessService.assertUserCanAccessEstablishment.mockResolvedValue(
        undefined,
      );
      mockEstablishmentCustomerRepository.findAllByEstablishmentPaginated.mockResolvedValue(
        {
          data: [
            { id: 'c-2', name: 'Maria' },
            { id: 'c-1', name: 'João' },
          ],
        },
      );

      const result = await service.execute(userId, establishmentId);

      expect(result).toEqual([
        { id: 'c-1', name: 'João' },
        { id: 'c-2', name: 'Maria' },
      ]);
      expect(
        mockEstablishmentAccessService.assertUserCanAccessEstablishment,
      ).toHaveBeenCalledWith(userId, establishmentId);
      expect(
        mockEstablishmentCustomerRepository.findAllByEstablishmentPaginated,
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
        mockEstablishmentCustomerRepository.findAllByEstablishmentPaginated,
      ).not.toHaveBeenCalled();
    });
  });
});
