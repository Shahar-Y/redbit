// The main logic of the package.
// Receiving the rabbit message and translating it to the wanted redis caching method.
import { ConsumerMessage } from 'menashmq';
import { CacheMessageSchema, MessageType } from './paramTypes';
import { logger } from './index';
import { Redis } from './infrastructure/redis';
import { criticalLog } from './utils/logger';

/**
 * handles the rabbit message and translates it to the wanted redis caching method.
 * @param rabbitMessage the rabbit message
 * @param redisClient the redis client
 */
export async function handleMessage(rabbitMessage: ConsumerMessage): Promise<void> {
  try {
    const content: Object = rabbitMessage.getContent();
    rabbitMessage.ack();

    logger.log(`New content: ${content}`);

    const validationResult = CacheMessageSchema.validate(content);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }

    const messageObject: MessageType = validationResult.value as MessageType;
    await Redis.setKey(messageObject.key, messageObject.value, messageObject.expire);
  } catch (err) {
    criticalLog(err);
  }

  return;
}
