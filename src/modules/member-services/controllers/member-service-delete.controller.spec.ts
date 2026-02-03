import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberServiceDeleteParamDTO } from '../dtos/member-service-delete-param.dto';
import { MemberServiceDeleteService } from '../services/member-service-delete.service';

import { MemberServiceDeleteController } from './member-service-delete.controller';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ErrorCode } from '@/enums/error-code';

describe('MemberServiceDeleteController', () => {
  let controller: MemberServiceDeleteController;
  let executeMock: jest.Mock;

  const requesterId = 'requester-123';
  const params: MemberServiceDeleteParamDTO = {
    memberId: 'member-456',
    serviceId: 'service-789',
  };

  beforeEach(async () => {
    executeMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberServiceDeleteController],
      providers: [
        {
          provide: MemberServiceDeleteService,
          useValue: { execute: executeMock },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MemberServiceDeleteController>(
      MemberServiceDeleteController,
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
