import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';
import { MemberServiceUpdateParamDTO } from '../dtos/member-service-update-param.dto';
import { MemberServiceUpdateRequestDTO } from '../dtos/member-service-update-request.dto';
import { MemberServiceUpdateService } from '../services/member-service-update.service';

import { MemberServiceUpdateController } from './member-service-update.controller';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ErrorCode } from '@/enums/error-code';

describe('MemberServiceUpdateController', () => {
  let controller: MemberServiceUpdateController;
  let executeMock: jest.Mock;

  const requesterId = 'requester-123';
  const params: MemberServiceUpdateParamDTO = {
    memberId: 'member-456',
    serviceId: 'service-789',
  };
  const dto: MemberServiceUpdateRequestDTO = {
    price: 6000,
    commission: 0.2,
    duration: 45,
  };
  const expectedResponse: MemberServiceCreateResponseDTO = {
    id: 'ms-1',
    memberId: params.memberId,
    establishmentId: 'est-1',
    serviceId: params.serviceId,
    price: dto.price!,
    commission: dto.commission!,
    duration: dto.duration!,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    executeMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberServiceUpdateController],
      providers: [
        {
          provide: MemberServiceUpdateService,
          useValue: { execute: executeMock },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MemberServiceUpdateController>(
      MemberServiceUpdateController,
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
        'Member service not found',
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_SERVICE_NOT_FOUND,
      );
      executeMock.mockRejectedValue(exception);

      await expect(controller.handle(requesterId, params, dto)).rejects.toThrow(
        CustomHttpException,
      );
    });
  });
});
