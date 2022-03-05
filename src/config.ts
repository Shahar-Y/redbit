import * as env from 'env-var';

export const config = {
  redis: {
    port: env.get('REDIS_PORT').default(6379).asPortNumber(),
    host: env.get('REDIS_HOST').default('localhost').asString(),
    names: {
      connectedUsers: env.get('REDIS_CONNECTED_USERS').default('connected-users').asString(),
    },
  },
  rabbit: {
    uri: env.get('RABBIT_URI').default('amqp://localhost').asString(),
    retries: env.get('RABBIT_RETRIES').default(3).asInt(),
    healthCheckInterval: env.get('RABBIT_HEALTH_CHECK_INTERVAL').default(5000).asInt(),
    queues: {
      cachingQueue: env.get('RABBIT_CACHING_QUEUE').default('caching-queue').asString(),
    },
  },
};
