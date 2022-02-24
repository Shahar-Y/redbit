import { menash, Topology } from 'menashmq';
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
  async initQueues(): Promise<void> {
    // Create new topology
    const topology: Topology = { queues: [], exchanges: [], bindings: [] };

    const { queue } = this.rabbitData;

    // If queue not exists, create it
    // TODO: change topology!
    if (!(queue.name in menash.queues)) {
      topology.queues?.push({
        name: queue.name,
        options: { durable: true },
      });

      // If exchange is set, create exchange
      if (queue.exchange) {
        if (!(queue.exchange.name in menash.exchanges))
          topology.exchanges?.push({
            name: queue.exchange.name,
            type: queue.exchange.type,
          });

        // If queue is bound to an exchange, bind it
        if (menash.bindings.bindings.length < 1) {
          topology.bindings?.push({
            source: queue.exchange.name,
            destination: queue.name,
            pattern: queue.exchange.routingKey,
          });
        }
      }
    }

    await menash.declareTopology(topology);
  }
}
