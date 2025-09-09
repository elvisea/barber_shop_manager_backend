import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsUUID, Max, Min } from 'class-validator';

/**
 * DTO base para serviços de agendamento
 * Usado em respostas da API e operações gerais
 */
export class AppointmentServiceDTO {
  @ApiProperty({
    description: 'ID do serviço do estabelecimento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'serviceId deve ser um UUID válido' })
  serviceId!: string;

  @ApiProperty({
    description: 'Preço do serviço em centavos',
    example: 2500,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'price deve ser um número' })
  @IsPositive({ message: 'price deve ser maior que zero' })
  price!: number;

  @ApiProperty({
    description: 'Duração do serviço em minutos',
    example: 30,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'duration deve ser um número' })
  @IsPositive({ message: 'duration deve ser maior que zero' })
  duration!: number;

  @ApiProperty({
    description: 'Comissão do funcionário (0.0 a 1.0)',
    example: 0.15,
    minimum: 0,
    maximum: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'commission deve ser um número' })
  @Min(0, { message: 'commission deve ser maior ou igual a 0' })
  @Max(1, { message: 'commission deve ser menor ou igual a 1' })
  commission!: number;
}
