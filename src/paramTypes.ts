import { ExchangeType } from "menashmq";

export type RabbitDataType = {
    queue: QueueObjectType;
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
