import { Injectable } from '@nestjs/common';
import { Subscription } from '@prisma/client';

import { ISubscriptionRepository } from '../contracts/subscription-repository.interface';
import { SubscriptionCreateDTO } from '../dtos/subscription-create.dto';
import { SubscriptionUpdateDTO } from '../dtos/subscription-update.dto';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(_data: SubscriptionCreateDTO): Promise<Subscription> {
    // TODO: Implementar
    return Promise.resolve({} as Subscription);
  }

  update(_id: string, _data: SubscriptionUpdateDTO): Promise<Subscription> {
    // TODO: Implementar
    return Promise.resolve({} as Subscription);
  }

  async delete(_id: string): Promise<void> {
    // TODO: Implementar
  }

  findAll(): Promise<Subscription[]> {
    // TODO: Implementar
    return Promise.resolve([]);
  }

  findById(_id: string): Promise<Subscription | null> {
    // TODO: Implementar
    return Promise.resolve(null);
  }

  async findActivePaidByPhone(
    phone: string,
    now: Date,
  ): Promise<Subscription | null> {
    return this.prisma.subscription.findFirst({
      where: {
        phone,
        status: 'ACTIVE',
        paid: true,
        endDate: { gt: now },
      },
    });
  }
}
