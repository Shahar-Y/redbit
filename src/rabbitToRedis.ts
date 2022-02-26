// The main logic of the package.
// Receiving the rabbit message and translating it to the wanted redis caching method.

import { ConsumerMessage } from 'menashmq';
import { Redis } from './utils/redis';

/**
 * handles the rabbit message and translates it to the wanted redis caching method.
 * @param rabbitMessage the rabbit message
 * @param redisClient the redis client
 */
export function handleMessage(rabbitMessage: ConsumerMessage): void {
  const content: Object | String = rabbitMessage.getContent();

  console.log(`New content: ${content}`);

  Redis.setKey('rabbitMessage.getRoutingKey()', content.toString());
  rabbitMessage.ack();

  return;
}
