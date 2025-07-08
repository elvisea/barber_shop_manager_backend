import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EstablishmentMemberCreateParamDTO {
  @ApiProperty({ example: 'uuid-establishment' })
  @IsNotEmpty()
  @IsUUID()
  establishmentId: string;
}
