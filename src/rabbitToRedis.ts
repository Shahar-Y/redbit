// The main logic of the package.
// Receiving the rabbit message and translating it to the wanted redis caching method.

import { ValidationResult } from 'joi';
import { ConsumerMessage } from 'menashmq';
import { CacheMessageSchema, MessageType } from './paramTypes';
import { Redis } from './utils/redis';

/**
 * handles the rabbit message and translates it to the wanted redis caching method.
 * @param rabbitMessage the rabbit message
 * @param redisClient the redis client
 */
export async function handleMessage(rabbitMessage: ConsumerMessage): Promise<void> {
  const content: Object = rabbitMessage.getContent();
  rabbitMessage.ack();

  console.log(`New content: ${content}`);

  try {
    const validationResult = CacheMessageSchema.validate(content);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }

    const messageObject: MessageType = validationResult.value as MessageType;
    await Redis.setKey(messageObject.key, messageObject.value, messageObject.expire);
  } catch (err) {
    console.log(err);
  }

  return;
}
