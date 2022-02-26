import { ConsumerMessage, ExchangeType } from 'menashmq';

export type RedisDataType = {
  host: string;
  port: number;
  password: string;
  dbIndex: number;
};

export type RabbitDataType = {
  queueName: string;
  msgHandlerFunction: MessageHandler;
  rabbitURI: string;
  rabbitRetries?: number;
  healthCheckInterval?: number;
};

export type ExchangeObjectType = {
  name: string;
  type: ExchangeType;
  routingKey?: string;
};

export type QueueObjectType = {
  name: string;
  exchange?: ExchangeObjectType;
};

export type MessageHandler = (msg: ConsumerMessage) => void;
