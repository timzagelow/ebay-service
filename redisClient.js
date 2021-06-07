require('dotenv').config();

const redis = require('redis');
const client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = { getAsync, setAsync };