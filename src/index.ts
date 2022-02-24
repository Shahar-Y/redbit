import { RabbitDataType } from './paramTypes';
import { Rabbit } from './utils/rabbit';
import { Redis } from './utils/redis';

async function initRedbit(rabbitData: RabbitDataType) {
  Redis.connect();

  const rabbitConn = new Rabbit(rabbitData);

  // Init rabbit connection
  await rabbitConn.initRabbit();
  rabbitConn.ensureRabbitHealth();
  console.log('successful connection to all queues in rabbit');
}

const myRabbitData: RabbitDataType = {
  queue: { name: 'MyQueueName' },
  rabbitURI: 'amqp://localhost',
};

initRedbit(myRabbitData);
