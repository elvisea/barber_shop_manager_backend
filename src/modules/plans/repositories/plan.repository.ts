import { Injectable } from '@nestjs/common';
import { Plan } from '@prisma/client';

import { IPlanRepository } from '../contracts/plan-repository.interface';
import { PlanCreateDTO } from '../dtos/plan-create.dto';
import { PlanUpdateDTO } from '../dtos/plan-update.dto';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PlanRepository implements IPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: PlanCreateDTO): Promise<Plan> {
    return this.prisma.plan.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        duration: data.duration,
        isActive: data.isActive ?? true,
      },
    });
  }

  async update(id: string, data: PlanUpdateDTO): Promise<Plan> {
    return this.prisma.plan.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.plan.delete({ where: { id } });
  }

  async findAll(): Promise<Plan[]> {
    return this.prisma.plan.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findAllPaginated(skip: number, take: number): Promise<Plan[]> {
    return this.prisma.plan.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(): Promise<number> {
    return this.prisma.plan.count();
  }

  async findById(id: string): Promise<Plan | null> {
    return this.prisma.plan.findUnique({ where: { id } });
  }
}
