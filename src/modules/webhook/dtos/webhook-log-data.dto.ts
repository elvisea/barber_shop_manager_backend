import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { getCurrentDate } from '@/common/utils/date-helpers';
import { WebhookEvent } from '../enums/webhook-event.enum';

export class WebhookLogDataDTO {
  @ApiProperty({ example: 'local-instance', required: false })
  @IsOptional()
  @IsString()
  local?: string;

  @ApiProperty({ example: 'https://api.example.com/webhook', required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    enum: WebhookEvent,
    example: WebhookEvent.MESSAGES_UPSERT,
    description: 'Tipo do evento do webhook',
  })
  @IsNotEmpty({ message: 'Event is required' })
  @IsEnum(WebhookEvent, { message: 'Event must be a valid webhook event type' })
  event: WebhookEvent;

  @ApiProperty({ example: 'instance-123', description: 'ID da instância' })
  @IsNotEmpty({ message: 'Instance is required' })
  @IsString()
  instance: string;

  @ApiProperty({
    example: { message: 'Hello world' },
    description: 'Dados do evento',
  })
  @IsNotEmpty({ message: 'Data is required' })
  data: any;

  @ApiProperty({
    example: 'destination-456',
    description: 'Destino do webhook',
  })
  @IsNotEmpty({ message: 'Destination is required' })
  @IsString()
  destination: string;

  @ApiProperty({
    example: getCurrentDate(),
    description: 'Data e hora do evento',
  })
  @IsNotEmpty({ message: 'Date time is required' })
  @IsString()
  date_time: string;

  @ApiProperty({
    example: '+5511999999999',
    description: 'Número do telefone do remetente',
  })
  @IsNotEmpty({ message: 'Sender is required' })
  @IsString()
  sender: string;

  @ApiProperty({
    example: 'https://server.example.com',
    description: 'URL do servidor',
  })
  @IsNotEmpty({ message: 'Server URL is required' })
  @IsString()
  server_url: string;

  @ApiProperty({
    example: 'api-key-123',
    description: 'Chave da API',
  })
  @IsNotEmpty({ message: 'API key is required' })
  @IsString()
  apikey: string;
}
