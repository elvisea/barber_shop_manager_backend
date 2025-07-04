import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EstablishmentCustomerFindByIdParamDTO {
  @ApiProperty({ example: 'uuid-estabelecimento' })
  @IsNotEmpty()
  @IsUUID('4')
  establishmentId: string;

  @ApiProperty({ example: 'uuid-cliente' })
  @IsNotEmpty()
  @IsUUID('4')
  customerId: string;
}
