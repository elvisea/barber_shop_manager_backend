import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class MemberServiceFindOneParamDTO {
  @ApiProperty({ example: 'uuid-member', description: 'ID of the member' })
  @IsNotEmpty()
  @IsUUID()
  memberId: string;

  @ApiProperty({ example: 'service-uuid', description: 'ID of the service' })
  @IsNotEmpty()
  @IsUUID()
  serviceId: string;
}
