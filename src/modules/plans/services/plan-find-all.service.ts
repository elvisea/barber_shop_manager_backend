import { Injectable, Logger } from '@nestjs/common';

import { PlanCreateResponseDTO } from '../dtos/plan-create-response.dto';
import { PlanFindAllQueryDTO } from '../dtos/plan-find-all-query.dto';
import { PlanFindAllResponseDTO } from '../dtos/plan-find-all-response.dto';
import { PlanRepository } from '../repositories/plan.repository';

@Injectable()
export class PlanFindAllService {
  private readonly logger = new Logger(PlanFindAllService.name);

  constructor(private readonly planRepository: PlanRepository) {}

  async execute(query: PlanFindAllQueryDTO): Promise<PlanFindAllResponseDTO> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    this.logger.log(`Listing plans: page ${page}, limit ${limit}`);

    // Prisma não suporta paginação nativa com count + findMany, então fazemos manualmente
    const [items, total] = await Promise.all([
      this.planRepository.findAllPaginated(skip, limit),
      this.planRepository.count(),
    ]);

    const data: PlanCreateResponseDTO[] = items.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }));

    return {
      data,
      meta: {
        page,
        limit,
        total: {
          items: total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }
}
