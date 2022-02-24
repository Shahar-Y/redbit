import * as redis from 'redis';
import { config } from '../config';

export class Redis {
  static client: redis.RedisClientType;

  static async connect(dbIndex = 0) {
    this.client = await redis.createClient({
      url: 'redis://localhost:6379',
    });

    await this.client.connect();

    this.client.on('error', (err) => console.log('Redis Client Error', err));

    await this.client.set('foo?', 'bar!');

    console.log(await this.client.get('foo?'));
  }
}
