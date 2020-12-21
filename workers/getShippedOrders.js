const redis = require('redis');
const client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const moment = require('moment');
const internalOrder = require('../api/internal/order');
const shipOrder = require('../workers/shipOrder');

async function getShippedOrders() {
    try {
        const lastShippedFetch = await getAsync('lastShippedFetch');

        const orders = await internalOrder.fetchShipped(lastShippedFetch);

        orders.forEach(async order => {
            await shipOrder(order.orderId);
        });

        await setLastFetch();
    } catch (err) {
        console.log(err)
    }
}

async function setLastFetch() {
    let date = moment().toISOString();
    await setAsync('lastOrdersFetch', date);
}

module.exports = getShippedOrders;