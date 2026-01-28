import { Injectable, Logger } from '@nestjs/common';

import { UserEstablishmentResponseDTO } from '../dtos/user-establishment-response.dto';
import { UserEstablishmentRepository } from '../repositories/user-establishment.repository';

@Injectable()
export class UserEstablishmentFindAllService {
  private readonly logger = new Logger(UserEstablishmentFindAllService.name);

  constructor(
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
  ) {}

  async execute(userId: string): Promise<UserEstablishmentResponseDTO[]> {
    this.logger.log(`Finding all establishments for user ${userId}`);

    const userEstablishments =
      await this.userEstablishmentRepository.findAllByUserWithRelations(userId);

    return userEstablishments.map((ue) => ({
      id: ue.id,
      establishmentId: ue.establishmentId,
      establishment: {
        id: ue.establishment.id,
        name: ue.establishment.name,
        address: ue.establishment.address,
        phone: ue.establishment.phone,
      },
      role: ue.role,
      isActive: ue.isActive,
      createdAt: ue.createdAt,
      updatedAt: ue.updatedAt,
    }));
  }
}
