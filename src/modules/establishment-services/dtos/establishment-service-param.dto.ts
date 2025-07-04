import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EstablishmentServiceIdParamDTO {
  @ApiProperty({ example: 'uuid-do-servico' })
  @IsUUID()
  @IsNotEmpty()
  serviceId: string;
}
