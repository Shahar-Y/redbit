import { ConsumerMessage, menash, Topology } from 'menashmq';
import { RabbitDataType } from '../paramTypes';
import sleep from './general';

/**
 * Check rabbit health status
 * @returns {boolean} isHealthy - true if healthy
 */
export function getRabbitHealthStatus(): boolean {
  return !menash.isClosed && menash.isReady;
}

export class Rabbit {
  rabbitData: RabbitDataType;
  healthCheckInterval = 30000;

  constructor(rabbitData: RabbitDataType) {
    this.rabbitData = rabbitData;
    if (rabbitData.healthCheckInterval) this.healthCheckInterval = rabbitData.healthCheckInterval;
  }

  /**
   * Init rabbitmq (connection and queues)
   */
  async initRabbit(): Promise<void> {
    console.log('initiating rabbit');
    await this.initConnection();
    await this.initQueue();
  }

  /**
   * Creates rabbitmq connection.
   */
  async initConnection(): Promise<void> {
    // Initialize rabbit connection if the conn isn't ready yet
    console.log(`connecting to rabbitMQ on URI: ${this.rabbitData.rabbitURI} ...`);

    if (!getRabbitHealthStatus()) {
      await menash.connect(this.rabbitData.rabbitURI, {
        retries: this.rabbitData.rabbitRetries,
      });
      console.log(`successful connection to rabbitMQ on URI: ${this.rabbitData.rabbitURI}`);
    } else {
      console.log(`rabbit ${this.rabbitData.rabbitURI} already connected`);
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
