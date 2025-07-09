import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class MemberProductCreateParamDTO {
  @ApiProperty({ example: 'uuid-establishment' })
  @IsNotEmpty()
  @IsUUID()
  establishmentId: string;

  @ApiProperty({ example: 'uuid-member' })
  @IsNotEmpty()
  @IsUUID()
  memberId: string;
}
