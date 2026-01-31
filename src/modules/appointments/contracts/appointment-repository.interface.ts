import { AppointmentRepositoryCreateDTO } from '../dtos/repository/appointment-repository-create.dto';
import { AppointmentRepositoryFindAllDTO } from '../dtos/repository/appointment-repository-find-all.dto';
import { AppointmentRepositoryUpdateDTO } from '../dtos/repository/appointment-repository-update.dto';
import { AppointmentWithRelations } from '../types/appointment-with-relations.type';

export interface IAppointmentRepository {
  /**
   * Cria um novo agendamento
   */
  create(
    data: AppointmentRepositoryCreateDTO,
  ): Promise<AppointmentWithRelations>;

  /**
   * Busca um agendamento por ID
   */
  findById(id: string): Promise<AppointmentWithRelations | null>;

  /**
   * Busca todos os agendamentos com filtros opcionais
   */
  findAll(
    query: AppointmentRepositoryFindAllDTO,
  ): Promise<AppointmentWithRelations[]>;

  /**
   * Conta o total de agendamentos com os mesmos filtros de findAll
   */
  count(query: AppointmentRepositoryFindAllDTO): Promise<number>;

  /**
   * Atualiza um agendamento existente
   */
  update(
    id: string,
    data: AppointmentRepositoryUpdateDTO,
  ): Promise<AppointmentWithRelations>;

  /**
   * Remove um agendamento (soft delete: marca deletedAt e deletedBy).
   */
  delete(id: string, deletedByUserId: string): Promise<void>;

  /**
   * Busca agendamentos por estabelecimento
   */
  findByEstablishmentId(
    establishmentId: string,
  ): Promise<AppointmentWithRelations[]>;

  /**
   * Busca agendamentos por usuário/funcionário
   */
  findByUserId(userId: string): Promise<AppointmentWithRelations[]>;

  /**
   * Busca agendamentos por cliente
   */
  findByCustomerId(customerId: string): Promise<AppointmentWithRelations[]>;

  /**
   * Busca agendamentos conflitantes para um usuário em um período específico
   */
  findConflictingAppointments(
    userId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string,
  ): Promise<AppointmentWithRelations[]>;
}
