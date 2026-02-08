import { MemberWithServicesResponseDTO } from '../dtos/member-with-services-response.dto';
import { MemberWithServices } from '../types/member-with-services.type';

export class MemberWithServicesMapper {
  static toDTO(member: MemberWithServices): MemberWithServicesResponseDTO {
    return {
      id: member.id,
      name: member.name,
      services:
        member.userServices?.map((us) => ({
          id: us.service.id,
          name: us.service.name,
        })) || [],
    };
  }
}
