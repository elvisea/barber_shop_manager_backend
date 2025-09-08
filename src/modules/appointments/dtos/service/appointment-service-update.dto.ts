import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

/**
 * DTO para atualização de serviços de agendamento
 * Usado ao atualizar preço, duração ou comissão de um serviço existente
 * Todos os campos são opcionais, mas pelo menos um deve ser informado
 */
export class AppointmentServiceUpdateDTO {
  @ApiProperty({
    description: 'Novo preço do serviço em centavos',
    example: 3000,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'price deve ser um número' })
  @IsPositive({ message: 'price deve ser maior que zero' })
  price?: number;

  @ApiProperty({
    description: 'Nova duração do serviço em minutos',
    example: 45,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'duration deve ser um número' })
  @IsPositive({ message: 'duration deve ser maior que zero' })
  duration?: number;

  @ApiProperty({
    description: 'Nova comissão do funcionário (0.0 a 1.0)',
    example: 0.2,
    minimum: 0,
    maximum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'commission deve ser um número' })
  @Min(0, { message: 'commission deve ser maior ou igual a 0' })
  @Max(1, { message: 'commission deve ser menor ou igual a 1' })
  commission?: number;

  /**
   * Validação customizada: pelo menos um campo deve ser informado
   */
  @ValidateIf((o) => !o.price && !o.duration && !o.commission)
  @IsOptional()
  @Type(() => Boolean)
  @IsNumber(
    {},
    { message: 'Pelo menos um campo deve ser informado para atualização' },
  )
  _atLeastOneField?: never;
}
