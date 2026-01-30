import { AppointmentStatus } from '@prisma/client';

import {
  AppointmentRepositoryMapper,
  AppointmentRepositoryCreateMapperParams,
  AppointmentRepositoryUpdateMapperParams,
} from './appointment-repository.mapper';

describe('AppointmentRepositoryMapper', () => {
  describe('toRepositoryCreateDTO', () => {
    it('deve mapear params para DTO de criação do repositório', () => {
      const startTime = new Date('2025-06-01T10:00:00.000Z');
      const endTime = '2025-06-01T11:00:00.000Z';
      const params: AppointmentRepositoryCreateMapperParams = {
        customerId: 'cust-123',
        userId: 'user-123',
        establishmentId: 'est-123',
        startTime,
        endTime,
        totalAmount: 5000,
        totalDuration: 60,
        notes: 'Observação',
        establishmentServices: [
          {
            id: 'svc-1',
            establishmentId: 'est-123',
            name: 'Corte',
            description: null,
            price: 3000,
            duration: 30,
            commission: 50 as never,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            deletedBy: null,
          },
        ] as never[],
      };

      const result = AppointmentRepositoryMapper.toRepositoryCreateDTO(params);

      expect(result.customerId).toBe(params.customerId);
      expect(result.userId).toBe(params.userId);
      expect(result.establishmentId).toBe(params.establishmentId);
      expect(result.startTime).toBe(startTime);
      expect(result.endTime).toEqual(new Date(endTime));
      expect(result.totalAmount).toBe(5000);
      expect(result.totalDuration).toBe(60);
      expect(result.status).toBe(AppointmentStatus.PENDING);
      expect(result.notes).toBe('Observação');
      expect(result.services).toHaveLength(1);
      expect(result.services[0]).toEqual({
        serviceId: 'svc-1',
        price: 3000,
        duration: 30,
        commission: 50,
      });
    });

    it('deve converter endTime string para Date', () => {
      const params: AppointmentRepositoryCreateMapperParams = {
        customerId: 'c',
        userId: 'u',
        establishmentId: 'e',
        startTime: new Date(),
        endTime: '2025-07-15T14:30:00.000Z',
        totalAmount: 0,
        totalDuration: 0,
        establishmentServices: [],
      };

      const result = AppointmentRepositoryMapper.toRepositoryCreateDTO(params);

      expect(result.endTime).toBeInstanceOf(Date);
      expect(result.endTime.toISOString()).toBe('2025-07-15T14:30:00.000Z');
    });

    it('deve mapear commission como número quando Decimal-like', () => {
      const params: AppointmentRepositoryCreateMapperParams = {
        customerId: 'c',
        userId: 'u',
        establishmentId: 'e',
        startTime: new Date(),
        endTime: new Date().toISOString(),
        totalAmount: 0,
        totalDuration: 0,
        establishmentServices: [
          {
            id: 'svc-1',
            establishmentId: 'e',
            name: 'S',
            description: null,
            price: 100,
            duration: 15,
            commission: { valueOf: () => 0.5 } as never,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            deletedBy: null,
          },
        ] as never[],
      };

      const result = AppointmentRepositoryMapper.toRepositoryCreateDTO(params);

      expect(result.services[0].commission).toBe(0.5);
    });
  });

  describe('toRepositoryUpdateDTO', () => {
    it('deve mapear params para DTO de atualização sem services', () => {
      const startTime = new Date('2025-06-01T10:00:00.000Z');
      const endTime = '2025-06-01T11:00:00.000Z';
      const params: AppointmentRepositoryUpdateMapperParams = {
        userId: 'user-123',
        startTime,
        endTime,
        totalAmount: 3000,
        totalDuration: 30,
        status: AppointmentStatus.CONFIRMED,
        notes: 'Atualizado',
        establishmentServices: undefined,
      };

      const result = AppointmentRepositoryMapper.toRepositoryUpdateDTO(params);

      expect(result.userId).toBe('user-123');
      expect(result.startTime).toBe(startTime);
      expect(result.endTime).toEqual(new Date(endTime));
      expect(result.totalAmount).toBe(3000);
      expect(result.totalDuration).toBe(30);
      expect(result.status).toBe(AppointmentStatus.CONFIRMED);
      expect(result.notes).toBe('Atualizado');
      expect(result.services).toBeUndefined();
    });

    it('deve incluir services quando establishmentServices é informado', () => {
      const params: AppointmentRepositoryUpdateMapperParams = {
        userId: 'user-123',
        startTime: new Date(),
        endTime: new Date().toISOString(),
        totalAmount: 5000,
        totalDuration: 45,
        status: AppointmentStatus.PENDING,
        notes: undefined,
        establishmentServices: [
          {
            id: 'svc-1',
            establishmentId: 'e',
            name: 'Corte',
            description: null,
            price: 3000,
            duration: 30,
            commission: 50 as never,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            deletedBy: null,
          },
        ] as never[],
      };

      const result = AppointmentRepositoryMapper.toRepositoryUpdateDTO(params);

      expect(result.services).toBeDefined();
      expect(result.services).toHaveLength(1);
      expect(result.services![0]).toEqual({
        serviceId: 'svc-1',
        price: 3000,
        duration: 30,
        commission: 50,
      });
    });
  });
});
