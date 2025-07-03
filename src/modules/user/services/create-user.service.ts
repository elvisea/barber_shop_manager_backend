import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { EmailService } from '@/email/email.service';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(CreateUserService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly userRepository: UserRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) { }

  async execute(userData: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
    this.logger.log(
      `Iniciando a criação do usuário com e-mail: ${userData.email}`,
    );

    // Verificar se o usuário já existe
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      this.logger.warn(
        `Usuário com o e-mail ${userData.email} já existe no sistema.`,
      );

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.USER_ALREADY_EXISTS,
        { EMAIL: userData.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.CONFLICT,
        ErrorCode.USER_ALREADY_EXISTS,
      );
    }

    this.logger.log(
      `Email ${userData.email} não encontrado. Prosseguindo com a criação do usuário.`,
    );

    try {
      // Criptografar a senha
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);
      this.logger.log(`Senha do usuário foi criptografada com sucesso.`);

      // Preparar dados para criação
      const userDataToCreate = {
        ...userData,
        password: hashedPassword,
      };

      // Criar usuário no banco
      const newUser = await this.userRepository.createUser(userDataToCreate);
      this.logger.log(`Usuário com ID ${newUser.id} criado com sucesso.`);

      // Enviar email de boas-vindas
      await this.emailService.sendEmail(
        newUser.email,
        'Bem-vindo!',
        `Olá ${newUser.name}, sua conta foi criada com sucesso!`,
      );

      // Criar response DTO
      const createUserResponseDTO = this.createUserResponse(newUser);

      this.logger.log(
        `Criação do usuário com e-mail ${createUserResponseDTO.email} concluída com sucesso.`,
      );

      return createUserResponseDTO;
    } catch (error) {
      this.logger.error(
        `Erro ao criar usuário com e-mail ${userData.email}: ${error.message}`,
      );

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.USER_CREATION_FAILED,
        { EMAIL: userData.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.USER_CREATION_FAILED,
      );
    }
  }

  // Função privada para criar o CreateUserResponseDTO
  private createUserResponse(user: User): CreateUserResponseDTO {
    const createUserResponseDTO = new CreateUserResponseDTO();
    createUserResponseDTO.id = user.id;
    createUserResponseDTO.name = user.name;
    createUserResponseDTO.email = user.email;
    createUserResponseDTO.phone = user.phone;
    createUserResponseDTO.createdAt = user.createdAt;
    createUserResponseDTO.updatedAt = user.updatedAt;

    return createUserResponseDTO;
  }
} 