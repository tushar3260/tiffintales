import Redis from 'ioredis';

const redis = new Redis({
  host: '127.0.0.1',   // or Redis cloud hostname
  port: 6379,          // default port
  password: '',        // optional
});

export default redis;
