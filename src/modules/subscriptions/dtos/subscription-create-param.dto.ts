import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SubscriptionCreateParamDTO {
  @ApiProperty({ example: 'uuid-estabelecimento' })
  @IsNotEmpty()
  @IsUUID()
  establishmentId: string;
}
