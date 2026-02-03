import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberProductDeleteParamDTO } from '../dtos/member-product-delete-param.dto';
import { MemberProductDeleteService } from '../services/member-product-delete.service';

import { MemberProductDeleteController } from './member-product-delete.controller';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ErrorCode } from '@/enums/error-code';

describe('MemberProductDeleteController', () => {
  let controller: MemberProductDeleteController;
  let executeMock: jest.Mock;

  const requesterId = 'requester-123';
  const params: MemberProductDeleteParamDTO = {
    memberId: 'member-456',
    productId: 'product-789',
  };

  beforeEach(async () => {
    executeMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberProductDeleteController],
      providers: [
        {
          provide: MemberProductDeleteService,
          useValue: { execute: executeMock },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MemberProductDeleteController>(
      MemberProductDeleteController,
    );
  });

  describe('handle', () => {
    it('should call service and return void on success', async () => {
      executeMock.mockResolvedValue(undefined);

      await controller.handle(requesterId, params);

      expect(executeMock).toHaveBeenCalledWith(params, requesterId);
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
