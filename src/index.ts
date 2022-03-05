import { config } from './config';
import Logger from './utils/logger';
import { RabbitDataType, RDBTOptions, RedisDataType } from './paramTypes';
import { handleMessage } from './rabbitToRedis';
import { Rabbit } from './infrastructure/rabbit';
import { Redis } from './infrastructure/redis';

// Default variables
const defaultOptions: RDBTOptions = { silent: true, prettify: true };

export let logger: Logger;

/**
 * The main logic of the package.
 * Receiving the rabbit message and translating it to the wanted redis caching method.
 * @param rabbitData - Information about the rabbit connection.
 * @param redisData - Information about the redis connection.
 * @param options - An optional parameter. Defaults to { silent: true, prettify: true }.
 */
export async function initRedbit(
  rabbitData: RabbitDataType,
  redisData: RedisDataType,
  opts?: Partial<RDBTOptions>
) {
  const options: RDBTOptions = { ...defaultOptions, ...opts };
  logger = new Logger(options);

  Redis.connect(redisData);

  const rabbitConn: Rabbit = new Rabbit(rabbitData);

  // Init rabbit connection
  await rabbitConn.initRabbit();
  rabbitConn.ensureRabbitHealth();

  logger.log('successful connection to all queues in rabbit');
}

const myRabbitData: RabbitDataType = {
  msgHandlerFunction: handleMessage,
  queueName: config.rabbit.queues.cachingQueue,
  rabbitURI: config.rabbit.uri,
};

const myRedisData: RedisDataType = {
  host: 'localhost',
  port: 6379,
  password: '',
  dbIndex: 0,
};

initRedbit(myRabbitData, myRedisData);
