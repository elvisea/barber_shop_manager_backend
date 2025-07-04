import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EstablishmentCustomerFindAllParamDTO {
  @ApiProperty({ example: 'uuid-estabelecimento' })
  @IsNotEmpty()
  @IsUUID('4')
  establishmentId: string;
}
