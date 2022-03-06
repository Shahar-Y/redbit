import * as env from 'env-var';

export const defaults = {
  redis: {
    port: 6379,
    host: 'localhost',
  },
  rabbit: {
    uri: 'amqp://localhost',
    healthCheckRetries: 3,
    healthCheckInterval: 5000,
    queues: {
      cachingQueue: 'caching-queue',
    },
  },
};
