import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberServiceFindOneParamDTO } from '../dtos/member-service-find-one-param.dto';
import { MemberServiceFindOneResponseDTO } from '../dtos/member-service-find-one-response.dto';
import { MemberServiceFindOneService } from '../services/member-service-find-one.service';

import { MemberServiceFindOneController } from './member-service-find-one.controller';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ErrorCode } from '@/enums/error-code';

describe('MemberServiceFindOneController', () => {
  let controller: MemberServiceFindOneController;
  let executeMock: jest.Mock;

  const requesterId = 'requester-123';
  const params: MemberServiceFindOneParamDTO = {
    memberId: 'member-456',
    serviceId: 'service-789',
  };
  const expectedResponse: MemberServiceFindOneResponseDTO = {
    id: 'ms-1',
    name: 'Corte',
    description: null,
    price: 5000,
    commission: 0.15,
    duration: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    executeMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberServiceFindOneController],
      providers: [
        {
          provide: MemberServiceFindOneService,
          useValue: { execute: executeMock },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MemberServiceFindOneController>(
      MemberServiceFindOneController,
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
        'Member service not found',
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_SERVICE_NOT_FOUND,
      );
      executeMock.mockRejectedValue(exception);

      await expect(controller.handle(requesterId, params)).rejects.toThrow(
        CustomHttpException,
      );
    });
  });
});
