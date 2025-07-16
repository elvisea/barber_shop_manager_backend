import { WebhookEvent } from '../enums/webhook-event.enum';

// Tipagem para a chave da mensagem
export interface MessageKey {
  remoteJid: string;
  fromMe: boolean;
  id: string;
  senderLid?: string;
  senderPn?: string;
  participant?: string;
  participantLid?: string;
}

// Tipagem para o conteúdo da mensagem (pode ser expandida conforme necessário)
export interface MessageContent {
  conversation?: string;
  messageContextInfo?: any; // Tipar melhor se necessário
  // Adicione outros tipos de mensagem conforme necessário
}

type Source = 'ios' | 'android' | 'web' | 'unknown' | 'desktop';

type Status =
  | 'ERROR'
  | 'PENDING'
  | 'SERVER_ACK'
  | 'DELIVERY_ACK'
  | 'READ'
  | 'DELETED'
  | 'PLAYED';

// Tipagem principal do evento messages.upsert
export interface MessagesUpsertData {
  key: MessageKey;
  pushName?: string;
  status?: Status;
  message: MessageContent;
  contextInfo?: any; // Tipar melhor se necessário
  messageType?: string;
  messageTimestamp: number;
  instanceId: string;
  source?: Source;
}

export interface WebhookLogData<T = any> {
  local?: string;
  url?: string;
  event: WebhookEvent;
  instance: string;
  data: T;
  destination: string;
  date_time: string;
  sender: string;
  server_url: string;
  apikey: string;
}

// Exemplo de uso:
export type ChatsUpdateLog = WebhookLogData;
export type MessagesUpsertLog = WebhookLogData<MessagesUpsertData>;