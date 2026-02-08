import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { MemberWithServicesResponseDTO } from '../dtos/member-with-services-response.dto';

export const MemberListWithServicesDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'List active members with their services',
      description:
        'Returns a list of members from the specified establishment, including their active services. Optimized for appointment creation.',
    }),
    ApiResponse({
      status: 200,
      description: 'List of members with services retrieved successfully',
      type: [MemberWithServicesResponseDTO],
    }),
    ApiResponse({
      status: 403,
      description:
        'Forbidden. User does not have access to this establishment.',
    }),
    ApiResponse({
      status: 404,
      description: 'Establishment not found.',
    }),
  );
};
