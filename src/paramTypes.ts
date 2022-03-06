import 'joi-extract-type';
import * as Joi from '@hapi/joi';
import { ConsumerMessage, ExchangeType } from 'menashmq';

export type RDBTOptions = {
  silent: boolean;
  prettify: boolean;
};

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
  healthCheckRetries?: number;
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

export const CacheMessageSchema = Joi.object({
  key: Joi.string().max(100).required(),
  value: Joi.string().alphanum().max(3000).required(),
  expire: Joi.number()
    .min(1)
    .max(1 * 60 * 60 * 24),
});

export type MessageType = Joi.extractType<typeof CacheMessageSchema>;
