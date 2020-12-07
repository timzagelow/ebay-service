const redis = require('redis');
const client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const moment = require('moment');
const createOrder = require('../workers/createOrder');
const apiOrder = require('../api/partner/order');

async function getOrders() {
    const lastOrdersFetch = await getAsync('lastOrdersFetch');

    const orders = await apiOrder.fetchNew(lastOrdersFetch);

    orders.forEach(async order => {
        await createOrder(order);
    });

    await setLastFetch();
}

async function setLastFetch() {
    let date = moment().utc().toISOString();
    await setAsync('lastOrdersFetch', date);
}

module.exports = getOrders;