import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EstablishmentMemberDeleteParamDTO {
  @ApiProperty({ example: 'uuid-establishment' })
  @IsNotEmpty()
  @IsUUID('4')
  establishmentId: string;

  @ApiProperty({ example: 'uuid-user' })
  @IsNotEmpty()
  @IsUUID('4')
  userId: string;
}
