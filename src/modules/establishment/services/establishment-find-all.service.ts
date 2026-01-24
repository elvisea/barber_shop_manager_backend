import { Injectable, Logger } from '@nestjs/common';

import { EstablishmentFindAllQueryDTO } from '../dtos/establishment-find-all-query.dto';
import { EstablishmentFindAllResponseDTO } from '../dtos/establishment-find-all-response.dto';
import { EstablishmentRepository } from '../repositories/establishment.repository';

@Injectable()
export class EstablishmentFindAllService {
  private readonly logger = new Logger(EstablishmentFindAllService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
  ) {}

  async execute(
    query: EstablishmentFindAllQueryDTO,
    userId: string,
  ): Promise<EstablishmentFindAllResponseDTO> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Finding all establishments for userId=${userId} with page ${page}, limit ${limit}`,
    );

    const { data, total } =
      await this.establishmentRepository.findAllByUserPaginated({
        userId,
        skip,
        take: limit,
      });

    return new EstablishmentFindAllResponseDTO(data, page, limit, total);
  }
}
