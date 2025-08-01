import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { BaseEstablishmentParamDTO } from '@/common/dtos/base-establishment-param';

export class MemberParamDTO extends BaseEstablishmentParamDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsString()
  @IsNotEmpty()
  memberId: string;
}
