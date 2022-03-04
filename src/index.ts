import { ConsumerMessage } from 'menashmq';
import { RabbitDataType, RedisDataType } from './paramTypes';
import { handleMessage } from './rabbitToRedis';
import { Rabbit } from './utils/rabbit';
import { Redis } from './utils/redis';

/**
 * defaultHandler - only logs the rabbit messages.
 * @param msg - the message received.
 */
const defaultHandler = (msg: ConsumerMessage) => {
  const content = msg.getContent();
  console.log(`New content: ${content}`);

  msg.ack();
};

export async function initRedbit(rabbitData: RabbitDataType, redisData: RedisDataType) {
  Redis.connect(redisData);

  const rabbitConn = new Rabbit(rabbitData);

  // Init rabbit connection
  await rabbitConn.initRabbit();
  rabbitConn.ensureRabbitHealth();
  console.log('successful connection to all queues in rabbit');
}

const myRabbitData: RabbitDataType = {
  msgHandlerFunction: handleMessage,
  queueName: 'MyQueueName',
  rabbitURI: 'amqp://localhost',
};

const myRedisData: RedisDataType = {
  host: 'localhost',
  port: 6379,
  password: '',
  dbIndex: 0,
};

initRedbit(myRabbitData, myRedisData);
