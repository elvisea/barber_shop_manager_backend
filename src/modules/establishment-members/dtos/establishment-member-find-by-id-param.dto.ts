import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EstablishmentMemberFindByIdParamDTO {
  @ApiProperty({ example: 'uuid-establishment' })
  @IsUUID()
  @IsNotEmpty()
  establishmentId: string;

  @ApiProperty({ example: 'uuid-member' })
  @IsUUID()
  @IsNotEmpty()
  memberId: string;
}
