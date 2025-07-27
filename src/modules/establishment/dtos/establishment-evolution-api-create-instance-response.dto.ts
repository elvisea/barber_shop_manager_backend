import { ApiProperty } from '@nestjs/swagger';

export class EstablishmentEvolutionApiCreateInstanceResponseDTO {
  @ApiProperty({
    example: {
      instanceName: 'establishment_123',
      instanceId: '4dce8cb1-f9b6-4275-9879-b43de412c621',
      integration: 'WHATSAPP-BAILEYS',
      webhookWaBusiness: null,
      accessTokenWaBusiness: '',
      status: 'connecting',
    },
    description: 'Dados da instância criada',
  })
  instance: {
    instanceName: string;
    instanceId: string;
    integration: string;
    webhookWaBusiness: string | null;
    accessTokenWaBusiness: string;
    status: string;
  };

  @ApiProperty({
    example: 'ACC0F39E-3A30-4CE3-83F3-B2D86E3E776B',
    description: 'Hash da instância',
  })
  hash: string;

  @ApiProperty({
    example: {},
    description: 'Configurações de webhook',
  })
  webhook: Record<string, any>;

  @ApiProperty({
    example: {},
    description: 'Configurações de WebSocket',
  })
  websocket: Record<string, any>;

  @ApiProperty({
    example: {},
    description: 'Configurações do RabbitMQ',
  })
  rabbitmq: Record<string, any>;

  @ApiProperty({
    example: {},
    description: 'Configurações do NATS',
  })
  nats: Record<string, any>;

  @ApiProperty({
    example: {},
    description: 'Configurações do SQS',
  })
  sqs: Record<string, any>;

  @ApiProperty({
    example: {
      rejectCall: false,
      msgCall: '',
      groupsIgnore: false,
      alwaysOnline: false,
      readMessages: false,
      readStatus: false,
      syncFullHistory: false,
      wavoipToken: '',
    },
    description: 'Configurações da instância',
  })
  settings: {
    rejectCall: boolean;
    msgCall: string;
    groupsIgnore: boolean;
    alwaysOnline: boolean;
    readMessages: boolean;
    readStatus: boolean;
    syncFullHistory: boolean;
    wavoipToken: string;
  };

  @ApiProperty({
    example: {
      pairingCode: null,
      code: '2@/2itoIvUhIMoATNJ9/aG0qinw8ily+EypWfkp/4SaRRf7c0OynASby43iae1cxi8t/jWL7/mXtIHX/1eMDRt1U/1N+jOVCax/uw=,Lacn0MS3LYHLShv+wytezZy8KNwJjwyPqVRUggs+lSU=,AXmzz0JmgUbYgD4N2pUUiiblHbJwU1aZuTxzmHyC2nU=,rVmoSimFKzwhSkDx733dyAjcfoF/HcYEokDIm6VzHEM=',
      base64: 'data:image/png;base64,Lacn0MS3LYHLShv+....',
      count: 1,
    },
    description: 'Dados do QR Code',
  })
  qrcode: {
    pairingCode: string | null;
    code: string;
    base64: string;
    count: number;
  };
}
