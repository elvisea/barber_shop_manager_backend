import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberProductFindOneParamDTO } from '../dtos/member-product-find-one-param.dto';
import { MemberProductFindOneResponseDTO } from '../dtos/member-product-find-one-response.dto';
import { MemberProductFindOneService } from '../services/member-product-find-one.service';

import { MemberProductFindOneController } from './member-product-find-one.controller';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ErrorCode } from '@/enums/error-code';

describe('MemberProductFindOneController', () => {
  let controller: MemberProductFindOneController;
  let executeMock: jest.Mock;

  const requesterId = 'requester-123';
  const params: MemberProductFindOneParamDTO = {
    memberId: 'member-456',
    productId: 'product-789',
  };
  const expectedResponse: MemberProductFindOneResponseDTO = {
    id: 'mp-1',
    name: 'Pomada',
    description: null,
    price: 5000,
    commission: 0.15,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    executeMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberProductFindOneController],
      providers: [
        {
          provide: MemberProductFindOneService,
          useValue: { execute: executeMock },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MemberProductFindOneController>(
      MemberProductFindOneController,
    );
  });

  describe('handle', () => {
    it('should return result from service on success', async () => {
      executeMock.mockResolvedValue(expectedResponse);

      const actual = await controller.handle(requesterId, params);

      expect(executeMock).toHaveBeenCalledWith(params, requesterId);
      expect(actual).toEqual(expectedResponse);
    });

    it('should propagate exception when service throws', async () => {
      const exception = new CustomHttpException(
        'Member product not found',
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_PRODUCT_NOT_FOUND,
      );
      executeMock.mockRejectedValue(exception);

      await expect(controller.handle(requesterId, params)).rejects.toThrow(
        CustomHttpException,
      );
    });
  });
});
