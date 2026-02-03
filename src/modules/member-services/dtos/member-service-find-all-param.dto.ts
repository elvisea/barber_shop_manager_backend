import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class MemberServiceFindAllParamDTO {
  @ApiProperty({ example: 'uuid-member' })
  @IsNotEmpty()
  @IsUUID()
  memberId: string;
}
