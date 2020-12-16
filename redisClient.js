require('dotenv').config();

let client;

if (process.env.NODE_ENV === 'production') {
    const RedisClustr = require('redis-clustr');
    const RedisClient = require('redis');

    client = new RedisClustr({
        servers: [
            {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
            }
        ],
        createClient: function (port, host) {
            // this is the default behaviour
            return RedisClient.createClient(port, host);
        }
    });
} else {
    const redis = require('redis');
    client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
}

module.exports = client;