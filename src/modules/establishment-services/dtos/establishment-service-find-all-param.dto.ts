import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EstablishmentServiceFindAllParamDTO {
  @ApiProperty({
    description: 'Establishment ID',
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
  })
  @IsNotEmpty()
  @IsUUID(4)
  establishmentId: string;
}
