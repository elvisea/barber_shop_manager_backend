import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberProductCreateParamDTO } from '../dtos/member-product-create-param.dto';
import { MemberProductCreateRequestDTO } from '../dtos/member-product-create-request.dto';
import { MemberProductCreateResponseDTO } from '../dtos/member-product-create-response.dto';
import { MemberProductCreateService } from '../services/member-product-create.service';

import { MemberProductCreateController } from './member-product-create.controller';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ErrorCode } from '@/enums/error-code';

describe('MemberProductCreateController', () => {
  let controller: MemberProductCreateController;
  let executeMock: jest.Mock;

  const requesterId = 'requester-123';
  const params: MemberProductCreateParamDTO = {
    memberId: 'member-456',
    productId: 'product-789',
  };
  const dto: MemberProductCreateRequestDTO = {
    price: 5000,
    commission: 0.15,
  };
  const expectedResponse: MemberProductCreateResponseDTO = {
    id: 'mp-1',
    memberId: params.memberId,
    establishmentId: 'est-1',
    productId: params.productId,
    price: dto.price,
    commission: dto.commission,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    executeMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberProductCreateController],
      providers: [
        {
          provide: MemberProductCreateService,
          useValue: { execute: executeMock },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MemberProductCreateController>(
      MemberProductCreateController,
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
        'Establishment not found',
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
      executeMock.mockRejectedValue(exception);

      await expect(controller.handle(requesterId, params, dto)).rejects.toThrow(
        CustomHttpException,
      );
    });
  });
});
