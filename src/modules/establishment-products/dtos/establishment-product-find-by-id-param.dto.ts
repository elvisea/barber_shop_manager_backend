import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EstablishmentProductFindByIdParamDTO {
  @ApiProperty({
    description: 'Establishment ID',
    example: 'uuid-estabelecimento',
  })
  @IsNotEmpty()
  @IsUUID()
  establishmentId: string;

  @ApiProperty({
    description: 'Product ID',
    example: 'uuid-produto',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
