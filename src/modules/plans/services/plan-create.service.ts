import { Injectable, Logger } from '@nestjs/common';

import { PlanCreateRequestDTO } from '../dtos/plan-create-request.dto';
import { PlanCreateResponseDTO } from '../dtos/plan-create-response.dto';
import { PlanCreateDTO } from '../dtos/plan-create.dto';
import { PlanRepository } from '../repositories/plan.repository';

@Injectable()
export class PlanCreateService {
  private readonly logger = new Logger(PlanCreateService.name);

  constructor(private readonly planRepository: PlanRepository) {}

  async execute(dto: PlanCreateRequestDTO): Promise<PlanCreateResponseDTO> {
    const data: PlanCreateDTO = {
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      duration: dto.duration,
      isActive: dto.isActive ?? true,
    };

    const plan = await this.planRepository.create(data);

    this.logger.log(`Plan created with id: ${plan.id}`);

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
