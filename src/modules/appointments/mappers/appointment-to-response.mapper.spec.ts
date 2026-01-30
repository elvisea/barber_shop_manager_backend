import { AppointmentToResponseMapper } from './appointment-to-response.mapper';

describe('AppointmentToResponseMapper', () => {
  describe('toResponseDTO', () => {
    it('deve mapear appointment com customer e user para DTO de resposta', () => {
      const startTime = new Date('2025-06-01T10:00:00.000Z');
      const endTime = new Date('2025-06-01T11:00:00.000Z');
      const createdAt = new Date('2025-05-01T00:00:00.000Z');
      const updatedAt = new Date('2025-05-02T00:00:00.000Z');
      const appointment = {
        id: 'apt-123',
        establishmentId: 'est-123',
        customerId: 'cust-123',
        customer: { name: 'Cliente Silva' },
        userId: 'user-123',
        user: { name: 'Barbeiro João' },
        startTime,
        endTime,
        totalAmount: 5000,
        totalDuration: 60,
        status: 'PENDING',
        notes: 'Observação',
        createdAt,
        updatedAt,
      } as never;

      const result = AppointmentToResponseMapper.toResponseDTO(appointment);

      expect(result.id).toBe('apt-123');
      expect(result.establishmentId).toBe('est-123');
      expect(result.customerId).toBe('cust-123');
      expect(result.customerName).toBe('Cliente Silva');
      expect(result.userId).toBe('user-123');
      expect(result.memberName).toBe('Barbeiro João');
      expect(result.startTime).toBe(startTime.toISOString());
      expect(result.endTime).toBe(endTime.toISOString());
      expect(result.totalAmount).toBe(5000);
      expect(result.totalDuration).toBe(60);
      expect(result.status).toBe('PENDING');
      expect(result.notes).toBe('Observação');
      expect(result.createdAt).toBe(createdAt);
      expect(result.updatedAt).toBe(updatedAt);
    });

    it('deve usar fallback string vazia para customerName quando customer ausente', () => {
      const appointment = {
        id: 'apt-1',
        establishmentId: 'e',
        customerId: 'c',
        customer: null,
        userId: 'u',
        user: { name: 'User' },
        startTime: new Date(),
        endTime: new Date(),
        totalAmount: 0,
        totalDuration: 0,
        status: 'PENDING',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never;

      const result = AppointmentToResponseMapper.toResponseDTO(appointment);

      expect(result.customerName).toBe('');
    });

    it('deve usar fallback string vazia para memberName quando user ausente', () => {
      const appointment = {
        id: 'apt-1',
        establishmentId: 'e',
        customerId: 'c',
        customer: { name: 'Cliente' },
        userId: 'u',
        user: null,
        startTime: new Date(),
        endTime: new Date(),
        totalAmount: 0,
        totalDuration: 0,
        status: 'PENDING',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never;

      const result = AppointmentToResponseMapper.toResponseDTO(appointment);

      expect(result.memberName).toBe('');
    });

    it('deve mapear notes null para undefined', () => {
      const appointment = {
        id: 'apt-1',
        establishmentId: 'e',
        customerId: 'c',
        customer: null,
        userId: 'u',
        user: null,
        startTime: new Date(),
        endTime: new Date(),
        totalAmount: 0,
        totalDuration: 0,
        status: 'PENDING',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never;

      const result = AppointmentToResponseMapper.toResponseDTO(appointment);

      expect(result.notes).toBeUndefined();
    });
  });
});
