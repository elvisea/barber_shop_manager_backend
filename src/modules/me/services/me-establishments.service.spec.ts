import { Test, TestingModule } from '@nestjs/testing';

import { MeEstablishmentsService } from './me-establishments.service';

import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

describe('MeEstablishmentsService', () => {
  let service: MeEstablishmentsService;

  const userId = 'user-123';

  const mockEstablishmentRepository = {
    findAllByUserPaginated: jest.fn(),
  };

  const mockUserEstablishmentRepository = {
    findAllByUserWithRelations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeEstablishmentsService,
        {
          provide: EstablishmentRepository,
          useValue: mockEstablishmentRepository,
        },
        {
          provide: UserEstablishmentRepository,
          useValue: mockUserEstablishmentRepository,
        },
      ],
    }).compile();

    service = module.get<MeEstablishmentsService>(MeEstablishmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar estabelecimentos mesclados e ordenados por name sem duplicatas', async () => {
      mockEstablishmentRepository.findAllByUserPaginated.mockResolvedValue({
        data: [
          { id: 'est-1', name: 'Barbearia A' },
          { id: 'est-2', name: 'Barbearia B' },
        ],
      });
      mockUserEstablishmentRepository.findAllByUserWithRelations.mockResolvedValue(
        [
          { establishment: { id: 'est-2', name: 'Barbearia B' } },
          { establishment: { id: 'est-3', name: 'Barbearia C' } },
        ],
      );

      const result = await service.execute(userId);

      expect(result).toEqual([
        { id: 'est-1', name: 'Barbearia A' },
        { id: 'est-2', name: 'Barbearia B' },
        { id: 'est-3', name: 'Barbearia C' },
      ]);
      expect(
        mockEstablishmentRepository.findAllByUserPaginated,
      ).toHaveBeenCalledWith({
        userId,
        skip: 0,
        take: 500,
      });
      expect(
        mockUserEstablishmentRepository.findAllByUserWithRelations,
      ).toHaveBeenCalledWith(userId);
    });
  });
});
