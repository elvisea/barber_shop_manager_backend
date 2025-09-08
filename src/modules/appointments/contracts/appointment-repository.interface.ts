import { Appointment } from '@prisma/client';

import { AppointmentFindAllQueryDTO } from '../dtos/api/appointment-find-all-query.dto';
import { AppointmentUpdateRequestDTO } from '../dtos/api/appointment-update-request.dto';
import { AppointmentRepositoryCreateDTO } from '../dtos/repository/appointment-repository-create.dto';

export interface IAppointmentRepository {
  /**
   * Cria um novo agendamento
   */
  create(data: AppointmentRepositoryCreateDTO): Promise<Appointment>;

  /**
   * Busca um agendamento por ID
   */
  findById(id: string): Promise<Appointment | null>;

  /**
   * Busca todos os agendamentos com filtros opcionais
   */
  findAll(query: AppointmentFindAllQueryDTO): Promise<Appointment[]>;

  /**
   * Atualiza um agendamento existente
   */
  update(id: string, data: AppointmentUpdateRequestDTO): Promise<Appointment>;

  /**
   * Remove um agendamento
   */
  delete(id: string): Promise<void>;

  /**
   * Busca agendamentos por estabelecimento
   */
  findByEstablishmentId(establishmentId: string): Promise<Appointment[]>;

  /**
   * Busca agendamentos por membro/funcionário
   */
  findByMemberId(memberId: string): Promise<Appointment[]>;

  /**
   * Busca agendamentos por cliente
   */
  findByCustomerId(customerId: string): Promise<Appointment[]>;
}
