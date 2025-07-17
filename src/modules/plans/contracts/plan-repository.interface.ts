import { Plan } from '@prisma/client';

import { PlanCreateDTO } from '../dtos/plan-create.dto';
import { PlanUpdateDTO } from '../dtos/plan-update.dto';

export interface IPlanRepository {
  /**
   * Cria um novo plano.
   */
  create(data: PlanCreateDTO): Promise<Plan>;

  /**
   * Atualiza um plano existente.
   */
  update(id: string, data: PlanUpdateDTO): Promise<Plan>;

  /**
   * Remove um plano pelo id.
   */
  delete(id: string): Promise<void>;

  /**
   * Lista todos os planos.
   */
  findAll(): Promise<Plan[]>;

  /**
   * Busca um plano pelo id.
   */
  findById(id: string): Promise<Plan | null>;

  /**
   * Lista planos paginados.
   */
  findAllPaginated(skip: number, take: number): Promise<Plan[]>;

  /**
   * Conta o total de planos.
   */
  count(): Promise<number>;
}
