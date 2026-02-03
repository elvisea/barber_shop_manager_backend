import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberProductCreateResponseDTO } from '../dtos/member-product-create-response.dto';
import { MemberProductUpdateParamDTO } from '../dtos/member-product-update-param.dto';
import { MemberProductUpdateRequestDTO } from '../dtos/member-product-update-request.dto';
import { MemberProductUpdateService } from '../services/member-product-update.service';

import { MemberProductUpdateController } from './member-product-update.controller';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ErrorCode } from '@/enums/error-code';

describe('MemberProductUpdateController', () => {
  let controller: MemberProductUpdateController;
  let executeMock: jest.Mock;

  const requesterId = 'requester-123';
  const params: MemberProductUpdateParamDTO = {
    memberId: 'member-456',
    productId: 'product-789',
  };
  const dto: MemberProductUpdateRequestDTO = {
    price: 6000,
    commission: 0.2,
  };
  const expectedResponse: MemberProductCreateResponseDTO = {
    id: 'mp-1',
    memberId: params.memberId,
    establishmentId: 'est-1',
    productId: params.productId,
    price: dto.price!,
    commission: dto.commission!,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    executeMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberProductUpdateController],
      providers: [
        {
          provide: MemberProductUpdateService,
          useValue: { execute: executeMock },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MemberProductUpdateController>(
      MemberProductUpdateController,
    );
  });

  describe('handle', () => {
    it('should return result from service on success', async () => {
      executeMock.mockResolvedValue(expectedResponse);

      const actual = await controller.handle(requesterId, params, dto);

      expect(executeMock).toHaveBeenCalledWith(dto, params, requesterId);
      expect(actual).toEqual(expectedResponse);
    });

    it('should propagate exception when service throws', async () => {
      const exception = new CustomHttpException(
        'Member product not found',
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_PRODUCT_NOT_FOUND,
      );
      executeMock.mockRejectedValue(exception);

      await expect(controller.handle(requesterId, params, dto)).rejects.toThrow(
        CustomHttpException,
      );
    });
  });
});
