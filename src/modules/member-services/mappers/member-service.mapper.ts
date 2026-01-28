import {
  EstablishmentService,
  UserService as UserServiceModel,
} from '@prisma/client';

export class MemberServiceMapper {
  static toFindAllResponse(
    memberService: UserServiceModel & { service: EstablishmentService },
  ) {
    return {
      id: memberService.service.id,
      name: memberService.service.name,
      description: memberService.service.description,
      createdAt: memberService.createdAt,
      updatedAt: memberService.updatedAt,
      duration: memberService.duration,
      price: memberService.price,
      commission: Number(memberService.commission),
    };
  }
}
