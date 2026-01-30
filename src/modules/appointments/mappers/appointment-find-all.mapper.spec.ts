import { AppointmentFindAllMapper } from './appointment-find-all.mapper';

describe('AppointmentFindAllMapper', () => {
  describe('toRepositoryQuery', () => {
    it('deve mapear query mínima para DTO do repositório', () => {
      const establishmentId = 'est-123';
      const query = {};
      const pagination = { page: 1, limit: 10, skip: 0 };

      const result = AppointmentFindAllMapper.toRepositoryQuery(
        establishmentId,
        query as never,
        pagination,
      );

      expect(result.establishmentId).toBe(establishmentId);
      expect(result.customerId).toBeUndefined();
      expect(result.userId).toBeUndefined();
      expect(result.status).toBeUndefined();
      expect(result.startDate).toBeUndefined();
      expect(result.endDate).toBeUndefined();
      expect(result.includeDeleted).toBe(false);
      expect(result.skip).toBe(0);
      expect(result.take).toBe(10);
    });

    it('deve mapear query com filtros opcionais', () => {
      const establishmentId = 'est-123';
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');
      const query = {
        customerId: 'cust-123',
        userId: 'user-123',
        status: 'PENDING',
        startDate,
        endDate,
        includeDeleted: true,
      };
      const pagination = { page: 2, limit: 20, skip: 20 };

      const result = AppointmentFindAllMapper.toRepositoryQuery(
        establishmentId,
        query as never,
        pagination,
      );

      expect(result.establishmentId).toBe(establishmentId);
      expect(result.customerId).toBe('cust-123');
      expect(result.userId).toBe('user-123');
      expect(result.status).toBe('PENDING');
      expect(result.startDate).toBe(startDate);
      expect(result.endDate).toBe(endDate);
      expect(result.includeDeleted).toBe(true);
      expect(result.skip).toBe(20);
      expect(result.take).toBe(20);
    });

    it('deve usar includeDeleted false quando query.includeDeleted é undefined', () => {
      const result = AppointmentFindAllMapper.toRepositoryQuery(
        'est-1',
        {} as never,
        { page: 1, limit: 10, skip: 0 },
      );

      expect(result.includeDeleted).toBe(false);
    });
  });

  describe('toResponseDTO', () => {
    it('deve mapear lista de appointments para DTO de resposta com paginação', () => {
      const appointments = [
        {
          id: 'apt-1',
          customerId: 'c1',
          customer: { name: 'Cliente 1' },
          userId: 'u1',
          user: { name: 'Barbeiro 1' },
          startTime: new Date('2025-06-01T10:00:00.000Z'),
          endTime: new Date('2025-06-01T11:00:00.000Z'),
          totalAmount: 3000,
          totalDuration: 30,
          status: 'PENDING',
          notes: null,
        },
      ];
      const pagination = { page: 1, limit: 10, skip: 0 };
      const totalItems = 1;

      const result = AppointmentFindAllMapper.toResponseDTO(
        appointments as never[],
        pagination,
        totalItems,
      );

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('apt-1');
      expect(result.data[0].customerId).toBe('c1');
      expect(result.data[0].customerName).toBe('Cliente 1');
      expect(result.data[0].userId).toBe('u1');
      expect(result.data[0].memberName).toBe('Barbeiro 1');
      expect(result.data[0].startTime).toBe('2025-06-01T10:00:00.000Z');
      expect(result.data[0].endTime).toBe('2025-06-01T11:00:00.000Z');
      expect(result.data[0].totalAmount).toBe(3000);
      expect(result.data[0].totalDuration).toBe(30);
      expect(result.data[0].status).toBe('PENDING');
      expect(result.data[0].notes).toBeUndefined();
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.itemsPerPage).toBe(10);
      expect(result.meta.totalItems).toBe(1);
    });

    it('deve usar fallback string vazia para customerName e memberName quando ausentes', () => {
      const appointments = [
        {
          id: 'apt-1',
          customerId: 'c1',
          customer: null,
          userId: 'u1',
          user: null,
          startTime: new Date(),
          endTime: new Date(),
          totalAmount: 0,
          totalDuration: 0,
          status: 'PENDING',
          notes: null,
        },
      ];
      const pagination = { page: 1, limit: 10, skip: 0 };

      const result = AppointmentFindAllMapper.toResponseDTO(
        appointments as never[],
        pagination,
        1,
      );

      expect(result.data[0].customerName).toBe('');
      expect(result.data[0].memberName).toBe('');
    });

    it('deve mapear notes null para undefined', () => {
      const appointments = [
        {
          id: 'apt-1',
          customerId: 'c1',
          customer: null,
          userId: 'u1',
          user: null,
          startTime: new Date(),
          endTime: new Date(),
          totalAmount: 0,
          totalDuration: 0,
          status: 'PENDING',
          notes: null,
        },
      ];
      const pagination = { page: 1, limit: 10, skip: 0 };

      const result = AppointmentFindAllMapper.toResponseDTO(
        appointments as never[],
        pagination,
        1,
      );

      expect(result.data[0].notes).toBeUndefined();
    });

    it('deve retornar meta de paginação correta para múltiplas páginas', () => {
      const result = AppointmentFindAllMapper.toResponseDTO(
        [],
        { page: 3, limit: 10, skip: 20 },
        25,
      );

      expect(result.meta.currentPage).toBe(3);
      expect(result.meta.itemsPerPage).toBe(10);
      expect(result.meta.totalItems).toBe(25);
      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(true);
    });
  });
});
