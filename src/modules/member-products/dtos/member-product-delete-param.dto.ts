import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class MemberProductDeleteParamDTO {
  @ApiProperty({
    example: 'uuid-establishment',
    description: 'ID of the establishment',
  })
  @IsNotEmpty()
  @IsUUID()
  establishmentId: string;

  @ApiProperty({ example: 'uuid-member', description: 'ID of the member' })
  @IsNotEmpty()
  @IsUUID()
  memberId: string;

  @ApiProperty({ example: 'product-uuid', description: 'ID of the product' })
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
