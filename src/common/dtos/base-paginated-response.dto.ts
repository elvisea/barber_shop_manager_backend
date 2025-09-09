import { ApiProperty } from '@nestjs/swagger';

class MetaTotal {
  @ApiProperty({ example: 1 })
  items: number;

  @ApiProperty({ example: 1 })
  pages: number;
}

class Meta {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ type: MetaTotal })
  total: MetaTotal;
}

export class BasePaginatedResponseDTO<T> {
  @ApiProperty({
    isArray: true,
    description: 'Array of items',
  })
  data: T[];

  @ApiProperty({ type: Meta })
  meta: Meta;
}
