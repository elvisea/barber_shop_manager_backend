import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MemberServiceCreateParamDTO } from '../dtos/member-service-create-param.dto';
import { MemberServiceCreateRequestDTO } from '../dtos/member-service-create-request.dto';
import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';
import { MemberServiceCreateService } from '../services/member-service-create.service';

import { MemberServiceCreateController } from './member-service-create.controller';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ErrorCode } from '@/enums/error-code';

describe('MemberServiceCreateController', () => {
  let controller: MemberServiceCreateController;
  let executeMock: jest.Mock;

  const requesterId = 'requester-123';
  const params: MemberServiceCreateParamDTO = {
    memberId: 'member-456',
    serviceId: 'service-789',
  };
  const dto: MemberServiceCreateRequestDTO = {
    price: 5000,
    commission: 0.15,
    duration: 30,
  };
  const expectedResponse: MemberServiceCreateResponseDTO = {
    id: 'ms-1',
    memberId: params.memberId,
    establishmentId: 'est-1',
    serviceId: params.serviceId,
    price: dto.price,
    commission: dto.commission,
    duration: dto.duration,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    executeMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberServiceCreateController],
      providers: [
        {
          provide: MemberServiceCreateService,
          useValue: { execute: executeMock },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MemberServiceCreateController>(
      MemberServiceCreateController,
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
