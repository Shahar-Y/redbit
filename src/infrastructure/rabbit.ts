import { menash } from 'menashmq';
import { RabbitDataType } from '../paramTypes';
import { logger } from '../index';
import sleep from '../utils/general';
import { defaults } from '../config';

/**
 * Check rabbit health status
 * @returns {boolean} isHealthy - true if healthy
 */
export function getRabbitHealthStatus(): boolean {
  return !menash.isClosed && menash.isReady;
}

export class Rabbit {
  rabbitData: RabbitDataType;
  healthCheckInterval: number;
  healthCheckRetries: number;

  constructor(rabbitData: RabbitDataType) {
    this.rabbitData = rabbitData;
    this.healthCheckInterval = rabbitData.healthCheckInterval
      ? rabbitData.healthCheckInterval
      : defaults.rabbit.healthCheckInterval;
    this.healthCheckRetries = rabbitData.healthCheckRetries
      ? rabbitData.healthCheckRetries
      : defaults.rabbit.healthCheckRetries;
  }

  /**
   * Init rabbitmq (connection and queues)
   */
  async initRabbit(): Promise<void> {
    logger.log('initiating rabbit');
    await this.initConnection();
    await this.initQueue();
  }

  /**
   * Creates rabbitmq connection.
   */
  async initConnection(): Promise<void> {
    // Initialize rabbit connection if the conn isn't ready yet
    logger.log(`connecting to rabbitMQ on URI: ${this.rabbitData.rabbitURI} ...`);

    if (!getRabbitHealthStatus()) {
      await menash.connect(this.rabbitData.rabbitURI, {
        retries: this.healthCheckRetries,
      });
      logger.log(`successful connection to rabbitMQ on URI: ${this.rabbitData.rabbitURI}`);
    } else {
      logger.log(`rabbit ${this.rabbitData.rabbitURI} already connected`);
    }
  }

  /**
   * Healthcheck for rabbitMQ connection and reconnecting in case of a failure.
   * @param {MongoWatcher} mongoWatcher - mongoWatcher instance
   */
  async ensureRabbitHealth(): Promise<void> {
    while (true) {
      if (!getRabbitHealthStatus()) {
        // If rabbitMQ unhealthy, close current connection and try reconnect
        await menash.close();
        await this.initRabbit();
      }

      await sleep(this.healthCheckInterval);
    }
  }

  /**
   * Init rabbitmq queues and exchanges binding
   */
  async initQueue(): Promise<void> {
    await menash.declareQueue(this.rabbitData.queueName);

    await menash
      .queue(this.rabbitData.queueName)
      .activateConsumer(this.rabbitData.msgHandlerFunction);
  }
}
