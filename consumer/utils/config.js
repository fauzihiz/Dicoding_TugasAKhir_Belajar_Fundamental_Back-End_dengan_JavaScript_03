require('dotenv').config();

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
  jwt: {
    key: process.env.ACCESS_TOKEN_KEY,
    age: process.env.ACCESS_TOKEN_AGE,
  },
};

module.exports = config;