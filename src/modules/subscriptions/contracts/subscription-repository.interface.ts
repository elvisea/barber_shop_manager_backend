import { Subscription } from '@prisma/client';

import { SubscriptionCreateDTO } from '../dtos/subscription-create.dto';
import { SubscriptionUpdateDTO } from '../dtos/subscription-update.dto';

export interface ISubscriptionRepository {
  /**
   * Cria uma nova assinatura.
   */
  create(data: SubscriptionCreateDTO): Promise<Subscription>;

  /**
   * Atualiza uma assinatura existente.
   */
  update(id: string, data: SubscriptionUpdateDTO): Promise<Subscription>;

  /**
   * Remove uma assinatura pelo id.
   */
  delete(id: string): Promise<void>;

  /**
   * Lista todas as assinaturas.
   */
  findAll(): Promise<Subscription[]>;

  /**
   * Busca uma assinatura pelo id.
   */
  findById(id: string): Promise<Subscription | null>;

  /**
   * Busca uma assinatura ativa paga pelo telefone.
   */
  findActivePaidByPhone(phone: string, now: Date): Promise<Subscription | null>;
}
