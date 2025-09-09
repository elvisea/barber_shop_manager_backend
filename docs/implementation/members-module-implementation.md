# 🛠️ Implementação do Módulo Members

## 📋 Visão Geral

Este documento detalha a implementação completa do módulo `members`, incluindo todos os arquivos necessários, validações, ErrorCodes e estrutura seguindo os padrões estabelecidos no projeto.

## 🎯 Estrutura de Arquivos

```
src/modules/members/
├── controllers/
│   ├── member-create.controller.ts
│   ├── member-delete.controller.ts
│   ├── member-find-all.controller.ts
│   ├── member-find-by-id.controller.ts
│   └── member-update.controller.ts
├── services/
│   ├── member-create.service.ts
│   ├── member-delete.service.ts
│   ├── member-find-all.service.ts
│   ├── member-find-by-id.service.ts
│   └── member-update.service.ts
├── repositories/
│   └── member.repository.ts
├── dtos/
│   ├── member-create-request.dto.ts
│   ├── member-create-response.dto.ts
│   ├── member-find-all-query.dto.ts
│   ├── member-find-all-response.dto.ts
│   ├── member-find-by-id-response.dto.ts
│   ├── member-update-request.dto.ts
│   ├── member-update-response.dto.ts
│   └── member-param.dto.ts
├── contracts/
│   └── member-repository.interface.ts
└── members.module.ts
```

## 🔧 Novos ErrorCodes Necessários

### **1. Adicionar ao `src/enums/error-code.ts`:**
```typescript
export enum ErrorCode {
  // ... códigos existentes ...
  
  // Novos códigos para Members
  MEMBER_EMAIL_ALREADY_EXISTS = 'MEMBER_EMAIL_ALREADY_EXISTS',
  MEMBER_PHONE_ALREADY_EXISTS = 'MEMBER_PHONE_ALREADY_EXISTS',
  MEMBER_NOT_FOUND = 'MEMBER_NOT_FOUND',
  MEMBER_CREATION_FAILED = 'MEMBER_CREATION_FAILED',
  MEMBER_UPDATE_FAILED = 'MEMBER_UPDATE_FAILED',
  MEMBER_DELETE_FAILED = 'MEMBER_DELETE_FAILED',
}
```

### **2. Adicionar ao `src/error-message/messages.ts`:**
```typescript
export const messages: Record<ErrorCode, { message: string }> = {
  // ... mensagens existentes ...
  
  [ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS]: {
    message: 'A member with email [EMAIL] already exists in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.MEMBER_PHONE_ALREADY_EXISTS]: {
    message: 'A member with phone [PHONE] already exists in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.MEMBER_NOT_FOUND]: {
    message: 'Member with ID [MEMBER_ID] not found in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.MEMBER_CREATION_FAILED]: {
    message: 'Failed to create member with email [EMAIL] in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.MEMBER_UPDATE_FAILED]: {
    message: 'Failed to update member with ID [MEMBER_ID] in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.MEMBER_DELETE_FAILED]: {
    message: 'Failed to delete member with ID [MEMBER_ID] from establishment [ESTABLISHMENT_ID].',
  },
} as const;
```

### **3. Adicionar ao `src/common/swagger-errors.ts`:**
```typescript
export const SwaggerErrors: SwaggerErrorsType = {
  // ... erros existentes ...
  
  [ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS]: {
    description: 'Member email already exists in establishment',
    example: {
      statusCode: 409,
      message: 'A member with email [EMAIL] already exists in establishment [ESTABLISHMENT_ID].',
      error: 'Conflict',
      errorCode: ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS,
    },
  },
  [ErrorCode.MEMBER_PHONE_ALREADY_EXISTS]: {
    description: 'Member phone already exists in establishment',
    example: {
      statusCode: 409,
      message: 'A member with phone [PHONE] already exists in establishment [ESTABLISHMENT_ID].',
      error: 'Conflict',
      errorCode: ErrorCode.MEMBER_PHONE_ALREADY_EXISTS,
    },
  },
  [ErrorCode.MEMBER_NOT_FOUND]: {
    description: 'Member not found',
    example: {
      statusCode: 404,
      message: 'Member with ID [MEMBER_ID] not found in establishment [ESTABLISHMENT_ID].',
      error: 'Not Found',
      errorCode: ErrorCode.MEMBER_NOT_FOUND,
    },
  },
  [ErrorCode.MEMBER_CREATION_FAILED]: {
    description: 'Member creation failed',
    example: {
      statusCode: 400,
      message: 'Failed to create member with email [EMAIL] in establishment [ESTABLISHMENT_ID].',
      error: 'Bad Request',
      errorCode: ErrorCode.MEMBER_CREATION_FAILED,
    },
  },
  [ErrorCode.MEMBER_UPDATE_FAILED]: {
    description: 'Member update failed',
    example: {
      statusCode: 400,
      message: 'Failed to update member with ID [MEMBER_ID] in establishment [ESTABLISHMENT_ID].',
      error: 'Bad Request',
      errorCode: ErrorCode.MEMBER_UPDATE_FAILED,
    },
  },
  [ErrorCode.MEMBER_DELETE_FAILED]: {
    description: 'Member delete failed',
    example: {
      statusCode: 400,
      message: 'Failed to delete member with ID [MEMBER_ID] from establishment [ESTABLISHMENT_ID].',
      error: 'Bad Request',
      errorCode: ErrorCode.MEMBER_DELETE_FAILED,
    },
  },
};
```

## 📝 Implementação dos DTOs

### **1. `member-param.dto.ts`:**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class MemberParamDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  establishmentId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsString()
  @IsNotEmpty()
  memberId: string;
}
```

### **2. `member-create-request.dto.ts`:**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsEmail, IsString, IsPhoneNumber, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class MemberCreateRequestDTO {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'joao@barbearia.com' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    enum: Role,
    example: Role.BARBER,
    description: 'Role of the member',
  })
  @IsEnum(Role)
  role: Role;
}
```

### **3. `member-create-response.dto.ts`:**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class MemberCreateResponseDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  establishmentId: string;

  @ApiProperty({ example: 'João da Silva' })
  name: string;

  @ApiProperty({ example: 'joao@barbearia.com' })
  email: string;

  @ApiProperty({ example: '+5511999999999' })
  phone: string;

  @ApiProperty({ enum: Role, example: Role.BARBER })
  role: Role;

  @ApiProperty({ example: false })
  emailVerified: boolean;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  updatedAt: Date;
}
```

### **4. `member-find-all-query.dto.ts`:**
```typescript
import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';

export class MemberFindAllQueryDTO extends BasePaginationQueryDTO {}
```

### **5. `member-find-all-response.dto.ts`:**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

export class MemberFindAllResponseDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ example: 'João da Silva' })
  name: string;

  @ApiProperty({ example: 'joao@barbearia.com' })
  email: string;

  @ApiProperty({ example: '+5511999999999' })
  phone: string;

  @ApiProperty({ enum: Role, example: Role.BARBER })
  role: Role;

  @ApiProperty({ example: false })
  emailVerified: boolean;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  updatedAt: Date;
}

export class MemberFindAllPaginatedResponseDTO extends BasePaginatedResponseDTO<MemberFindAllResponseDTO> {}
```

### **6. `member-find-by-id-response.dto.ts`:**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class MemberFindByIdResponseDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  establishmentId: string;

  @ApiProperty({ example: 'João da Silva' })
  name: string;

  @ApiProperty({ example: 'joao@barbearia.com' })
  email: string;

  @ApiProperty({ example: '+5511999999999' })
  phone: string;

  @ApiProperty({ enum: Role, example: Role.BARBER })
  role: Role;

  @ApiProperty({ example: false })
  emailVerified: boolean;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  updatedAt: Date;
}
```

### **7. `member-update-request.dto.ts`:**
```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsOptional, IsEnum, IsString, IsEmail, IsPhoneNumber, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class MemberUpdateRequestDTO {
  @ApiPropertyOptional({ example: 'João da Silva' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'joao@barbearia.com' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase())
  email?: string;

  @ApiPropertyOptional({ example: '+5511999999999' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.BARBER,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

### **8. `member-update-response.dto.ts`:**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class MemberUpdateResponseDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ example: 'João da Silva' })
  name: string;

  @ApiProperty({ example: 'joao@barbearia.com' })
  email: string;

  @ApiProperty({ example: '+5511999999999' })
  phone: string;

  @ApiProperty({ enum: Role, example: Role.BARBER })
  role: Role;

  @ApiProperty({ example: false })
  emailVerified: boolean;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  updatedAt: Date;
}
```

## 🔧 Implementação dos Contratos

### **`member-repository.interface.ts`:**
```typescript
import { Member, Role } from '@prisma/client';

export interface IMemberRepository {
  createMember(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
    establishmentId: string;
  }): Promise<Member>;

  findById(id: string): Promise<Member | null>;

  findByEstablishmentAndId(
    establishmentId: string,
    memberId: string,
  ): Promise<Member | null>;

  findAllByEstablishmentPaginated({
    establishmentId,
    skip,
    take,
  }: {
    establishmentId: string;
    skip: number;
    take: number;
  }): Promise<{
    data: Member[];
    total: number;
  }>;

  updateMember(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      role: Role;
      isActive: boolean;
    }>,
  ): Promise<Member>;

  deleteMember(id: string): Promise<void>;

  existsByEmailAndEstablishment(
    email: string,
    establishmentId: string,
  ): Promise<boolean>;

  existsByPhoneAndEstablishment(
    phone: string,
    establishmentId: string,
  ): Promise<boolean>;

  existsByEmailAndEstablishmentExcludingId(
    email: string,
    establishmentId: string,
    excludeId: string,
  ): Promise<boolean>;

  existsByPhoneAndEstablishmentExcludingId(
    phone: string,
    establishmentId: string,
    excludeId: string,
  ): Promise<boolean>;
}
```

## 🏗️ Implementação do Repository

### **`member.repository.ts`:**
```typescript
import { Injectable } from '@nestjs/common';
import { Member, Role } from '@prisma/client';

import { IMemberRepository } from '../contracts/member-repository.interface';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MemberRepository implements IMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMember(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
    establishmentId: string;
  }): Promise<Member> {
    return this.prisma.member.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        establishmentId: data.establishmentId,
      },
    });
  }

  async findById(id: string): Promise<Member | null> {
    return this.prisma.member.findUnique({
      where: { id },
    });
  }

  async findByEstablishmentAndId(
    establishmentId: string,
    memberId: string,
  ): Promise<Member | null> {
    return this.prisma.member.findFirst({
      where: {
        id: memberId,
        establishmentId,
      },
    });
  }

  async findAllByEstablishmentPaginated({
    establishmentId,
    skip,
    take,
  }: {
    establishmentId: string;
    skip: number;
    take: number;
  }): Promise<{
    data: Member[];
    total: number;
  }> {
    const [data, total] = await Promise.all([
      this.prisma.member.findMany({
        where: { establishmentId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.member.count({ where: { establishmentId } }),
    ]);
    return { data, total };
  }

  async updateMember(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      role: Role;
      isActive: boolean;
    }>,
  ): Promise<Member> {
    return this.prisma.member.update({
      where: { id },
      data,
    });
  }

  async deleteMember(id: string): Promise<void> {
    await this.prisma.member.delete({
      where: { id },
    });
  }

  async existsByEmailAndEstablishment(
    email: string,
    establishmentId: string,
  ): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: { email, establishmentId },
    });
    return count > 0;
  }

  async existsByPhoneAndEstablishment(
    phone: string,
    establishmentId: string,
  ): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: { phone, establishmentId },
    });
    return count > 0;
  }

  async existsByEmailAndEstablishmentExcludingId(
    email: string,
    establishmentId: string,
    excludeId: string,
  ): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: {
        email,
        establishmentId,
        id: { not: excludeId },
      },
    });
    return count > 0;
  }

  async existsByPhoneAndEstablishmentExcludingId(
    phone: string,
    establishmentId: string,
    excludeId: string,
  ): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: {
        phone,
        establishmentId,
        id: { not: excludeId },
      },
    });
    return count > 0;
  }
}
```

## 🎯 Implementação dos Services

### **`member-create.service.ts`:**
```typescript
import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberCreateRequestDTO, MemberCreateResponseDTO } from '../dtos';
import { IMemberRepository } from '../contracts';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';
import { generateTempPassword } from '@/utils/generate-temp-password';
import { hashValue } from '@/utils/hash-value';

@Injectable()
export class MemberCreateService {
  private readonly logger = new Logger(MemberCreateService.name);

  constructor(
    private readonly memberRepository: IMemberRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) {}

  async execute(
    dto: MemberCreateRequestDTO,
    establishmentId: string,
    requesterId: string,
  ): Promise<MemberCreateResponseDTO> {
    this.logger.log(
      `Creating member for establishment ${establishmentId} by user ${requesterId}`,
    );

    // 1. Verifica se o estabelecimento existe e o usuário tem permissão
    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      requesterId,
      true, // requireAdmin = true
    );

    // 2. Verifica se já existe membro com este email no estabelecimento
    const emailExists = await this.memberRepository.existsByEmailAndEstablishment(
      dto.email,
      establishmentId,
    );

    if (emailExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS,
        { EMAIL: dto.email, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS,
      );
    }

    // 3. Verifica se já existe membro com este telefone no estabelecimento
    const phoneExists = await this.memberRepository.existsByPhoneAndEstablishment(
      dto.phone,
      establishmentId,
    );

    if (phoneExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_PHONE_ALREADY_EXISTS,
        { PHONE: dto.phone, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.MEMBER_PHONE_ALREADY_EXISTS,
      );
    }

    // 4. Gera senha temporária e faz hash
    const tempPassword = generateTempPassword(8);
    const hashedPassword = await hashValue(tempPassword);

    // 5. Cria o membro
    try {
      const member = await this.memberRepository.createMember({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: dto.role,
        establishmentId,
      });

      this.logger.log(`Member created with ID: ${member.id}`);

      // TODO: Enviar email com senha temporária para o membro
      this.logger.log(`Temporary password for ${dto.email}: ${tempPassword}`);

      return {
        id: member.id,
        establishmentId: member.establishmentId,
        name: member.name,
        email: member.email,
        phone: member.phone,
        role: member.role,
        emailVerified: member.emailVerified,
        isActive: member.isActive,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      };
    } catch (error) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_CREATION_FAILED,
        { EMAIL: dto.email, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.error(`Failed to create member: ${error.message}`);

      throw new CustomHttpException(
        message,
        HttpStatus.BAD_REQUEST,
        ErrorCode.MEMBER_CREATION_FAILED,
      );
    }
  }
}
```

### **`member-find-all.service.ts`:**
```typescript
import { Injectable, Logger } from '@nestjs/common';

import { MemberFindAllQueryDTO, MemberFindAllPaginatedResponseDTO } from '../dtos';
import { IMemberRepository } from '../contracts';

import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class MemberFindAllService {
  private readonly logger = new Logger(MemberFindAllService.name);

  constructor(
    private readonly memberRepository: IMemberRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) {}

  async execute(
    establishmentId: string,
    requesterId: string,
    query: MemberFindAllQueryDTO,
  ): Promise<MemberFindAllPaginatedResponseDTO> {
    this.logger.log(
      `Finding all members for establishment ${establishmentId} by user ${requesterId}`,
    );

    // 1. Verifica se o estabelecimento existe e o usuário tem permissão
    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      requesterId,
      true, // requireAdmin = true
    );

    // 2. Calcula paginação
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // 3. Busca membros paginados
    const { data, total } = await this.memberRepository.findAllByEstablishmentPaginated({
      establishmentId,
      skip,
      take: limit,
    });

    // 4. Calcula metadados da paginação
    const totalPages = Math.ceil(total / limit);

    // 5. Mapeia dados para resposta
    const members = data.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      emailVerified: member.emailVerified,
      isActive: member.isActive,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    }));

    this.logger.log(`Found ${members.length} members out of ${total} total`);

    return {
      data: members,
      meta: {
        page,
        limit,
        total: {
          items: total,
          pages: totalPages,
        },
      },
    };
  }
}
```

## 🎮 Implementação dos Controllers

### **`member-create.controller.ts`:**
```typescript
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MemberCreateRequestDTO } from '../dtos/member-create-request.dto';
import { MemberCreateResponseDTO } from '../dtos/member-create-response.dto';
import { MemberParamDTO } from '../dtos/member-param.dto';
import { MemberCreateService } from '../services/member-create.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';

@ApiTags('Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members')
@UseGuards(JwtAuthGuard)
export class MemberCreateController {
  constructor(
    private readonly memberCreateService: MemberCreateService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({ status: 201, type: MemberCreateResponseDTO })
  @ApiConflictResponse({
    description: SwaggerErrors[ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS].description,
    schema: {
      example: SwaggerErrors[ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS].example,
    },
  })
  @ApiConflictResponse({
    description: SwaggerErrors[ErrorCode.MEMBER_PHONE_ALREADY_EXISTS].description,
    schema: {
      example: SwaggerErrors[ErrorCode.MEMBER_PHONE_ALREADY_EXISTS].example,
    },
  })
  @ApiNotFoundResponse({
    description: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    schema: {
      oneOf: [
        {
          example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
        },
        {
          example: SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
        },
      ],
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
    @Body() dto: MemberCreateRequestDTO,
  ): Promise<MemberCreateResponseDTO> {
    return this.memberCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
```

### **`member-find-all.controller.ts`:**
```typescript
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MemberFindAllQueryDTO } from '../dtos/member-find-all-query.dto';
import { MemberFindAllPaginatedResponseDTO } from '../dtos/member-find-all-response.dto';
import { MemberParamDTO } from '../dtos/member-param.dto';
import { MemberFindAllService } from '../services/member-find-all.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';

@ApiTags('Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members')
@UseGuards(JwtAuthGuard)
export class MemberFindAllController {
  constructor(
    private readonly memberFindAllService: MemberFindAllService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find all members with pagination' })
  @ApiResponse({ status: 200, type: MemberFindAllPaginatedResponseDTO })
  @ApiNotFoundResponse({
    description: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    schema: {
      oneOf: [
        {
          example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
        },
        {
          example: SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
        },
      ],
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
    @Query() query: MemberFindAllQueryDTO,
  ): Promise<MemberFindAllPaginatedResponseDTO> {
    return this.memberFindAllService.execute(
      params.establishmentId,
      userId,
      query,
    );
  }
}
```

## 📦 Implementação do Módulo

### **`members.module.ts`:**
```typescript
import { Module } from '@nestjs/common';

import { MemberCreateController } from './controllers/member-create.controller';
import { MemberDeleteController } from './controllers/member-delete.controller';
import { MemberFindAllController } from './controllers/member-find-all.controller';
import { MemberFindByIdController } from './controllers/member-find-by-id.controller';
import { MemberUpdateController } from './controllers/member-update.controller';
import { MemberCreateService } from './services/member-create.service';
import { MemberDeleteService } from './services/member-delete.service';
import { MemberFindAllService } from './services/member-find-all.service';
import { MemberFindByIdService } from './services/member-find-by-id.service';
import { MemberUpdateService } from './services/member-update.service';
import { MemberRepository } from './repositories/member.repository';

import { ErrorMessageModule } from '@/error-message/error-message.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [PrismaModule, ErrorMessageModule, SharedModule],
  controllers: [
    MemberCreateController,
    MemberDeleteController,
    MemberFindAllController,
    MemberFindByIdController,
    MemberUpdateController,
  ],
  providers: [
    MemberCreateService,
    MemberDeleteService,
    MemberFindAllService,
    MemberFindByIdService,
    MemberUpdateService,
    {
      provide: 'IMemberRepository',
      useClass: MemberRepository,
    },
  ],
  exports: ['IMemberRepository'],
})
export class MembersModule {}
```

## 🎯 Classe Auxiliar para Validações

### **`establishment-owner-access.service.ts`:**
```typescript
import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

@Injectable()
export class EstablishmentOwnerAccessService {
  private readonly logger = new Logger(EstablishmentOwnerAccessService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Verifica se o estabelecimento existe e se o usuário é o dono
   * @param establishmentId string
   * @param ownerId string
   * @returns establishment entity se encontrado e usuário é dono
   */
  async assertOwnerHasAccess(
    establishmentId: string,
    ownerId: string,
  ) {
    this.logger.log(
      `Checking owner access for user ${ownerId} to establishment ${establishmentId}`,
    );

    // 1. Verifica se o estabelecimento existe
    const establishment = await this.establishmentRepository.findById(establishmentId);

    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(
        `Establishment not found: ${establishmentId} | User: ${ownerId}`,
      );

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    // 2. Verifica se o usuário é o dono do estabelecimento
    if (establishment.ownerId !== ownerId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: ownerId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    this.logger.log(
      `Owner access granted for user ${ownerId} to establishment ${establishmentId}`,
    );
    return establishment;
  }
}
```

## 📋 Checklist de Implementação

### **Fase 1: Infraestrutura**
- [ ] Adicionar novos ErrorCodes ao enum
- [ ] Adicionar mensagens de erro
- [ ] Adicionar documentação Swagger
- [ ] Criar classe auxiliar para validações
- [ ] Criar estrutura de pastas do módulo

### **Fase 2: DTOs e Contratos**
- [ ] Implementar todos os DTOs (usando BasePaginationQueryDTO e BasePaginatedResponseDTO)
- [ ] Implementar interface do repositório
- [ ] Implementar repositório

### **Fase 3: Services**
- [ ] Implementar MemberCreateService (com geração de senha temporária)
- [ ] Implementar MemberFindAllService (com paginação)
- [ ] Implementar MemberFindByIdService
- [ ] Implementar MemberUpdateService
- [ ] Implementar MemberDeleteService

### **Fase 4: Controllers**
- [ ] Implementar MemberCreateController
- [ ] Implementar MemberFindAllController (com resposta paginada)
- [ ] Implementar MemberFindByIdController
- [ ] Implementar MemberUpdateController
- [ ] Implementar MemberDeleteController

### **Fase 5: Módulo e Testes**
- [ ] Configurar MembersModule
- [ ] Implementar testes unitários
- [ ] Implementar testes e2e
- [ ] Documentar APIs

## 🔧 Funções Utilitárias Utilizadas

### **1. Geração de Senha Temporária:**
```typescript
import { generateTempPassword } from '@/utils/generate-temp-password';

// Gera senha temporária de 8 caracteres
const tempPassword = generateTempPassword(8);
```

### **2. Hash de Senha:**
```typescript
import { hashValue } from '@/utils/hash-value';

// Faz hash da senha
const hashedPassword = await hashValue(tempPassword);
```

### **3. Paginação:**
```typescript
import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

// DTO de query para paginação
export class MemberFindAllQueryDTO extends BasePaginationQueryDTO {}

// DTO de resposta paginada
export class MemberFindAllPaginatedResponseDTO extends BasePaginatedResponseDTO<MemberFindAllResponseDTO> {}
```

## 🎯 Próximos Passos

1. **Implementar ErrorCodes e mensagens**
2. **Criar estrutura de pastas**
3. **Implementar DTOs e contratos**
4. **Implementar repository**
5. **Implementar services**
6. **Implementar controllers**
7. **Configurar módulo**
8. **Implementar testes**

---

**Documento criado em:** $(date)
**Versão:** 1.0
**Status:** Em desenvolvimento 