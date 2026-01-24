import { ApiProperty } from '@nestjs/swagger';

import { PaginatedResultUtil } from '../utils/pagination.util';

export class BasePaginatedResponseDTO<T> extends PaginatedResultUtil<T> {
  @ApiProperty({
    isArray: true,
    description: 'Array of items',
  })
  declare data: T[];

  @ApiProperty({
    type: PaginatedResultUtil,
    description: 'Pagination metadata',
  })
  declare meta: PaginatedResultUtil<T>['meta'];
}
