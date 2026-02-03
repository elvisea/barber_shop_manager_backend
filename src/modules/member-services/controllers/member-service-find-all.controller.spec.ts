import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberServiceFindAllParamDTO } from '../dtos/member-service-find-all-param.dto';
import { MemberServiceFindAllResponseDTO } from '../dtos/member-service-find-all-response.dto';
import { MemberServiceFindAllService } from '../services/member-service-find-all.service';

import { MemberServiceFindAllController } from './member-service-find-all.controller';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ErrorCode } from '@/enums/error-code';

describe('MemberServiceFindAllController', () => {
  let controller: MemberServiceFindAllController;
  let executeMock: jest.Mock;

  const requesterId = 'requester-123';
  const params: MemberServiceFindAllParamDTO = { memberId: 'member-456' };
  const query: BasePaginationQueryDTO = { page: 1, limit: 10 };
  const expectedResponse: MemberServiceFindAllResponseDTO = {
    data: [],
    meta: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  beforeEach(async () => {
    executeMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberServiceFindAllController],
      providers: [
        {
          provide: MemberServiceFindAllService,
          useValue: { execute: executeMock },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MemberServiceFindAllController>(
      MemberServiceFindAllController,
    );
  });

  describe('handle', () => {
    it('should return result from service on success', async () => {
      executeMock.mockResolvedValue(expectedResponse);

      const actual = await controller.handle(requesterId, params, query);

      expect(executeMock).toHaveBeenCalledWith(params, query, requesterId);
      expect(actual).toEqual(expectedResponse);
    });

    it('should propagate exception when service throws', async () => {
      const exception = new CustomHttpException(
        'Member not found',
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_NOT_FOUND,
      );
      executeMock.mockRejectedValue(exception);

      await expect(
        controller.handle(requesterId, params, query),
      ).rejects.toThrow(CustomHttpException);
    });
  });
});
