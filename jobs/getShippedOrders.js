require('dotenv').config();
const redisClient = require('../redisClient');
const moment = require('moment');
const internalOrder = require('../api/internal/order');
const shipOrder = require('../handlers/shipOrder');
const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, ns: "rsmq"});
const auth = require('../auth');
const api = require('../api');

(async() => {
    try {
        await auth.getToken();
        api.init();

        const lastShippedFetch = await redisClient.getAsync('lastShippedFetch');

        const orders = await internalOrder.fetchShipped(lastShippedFetch);

        for (let i = 0; i < orders.length; i++) {
            if (orders[i].platform.site === 'eBay') {
                console.log(`shipping order ${orders[i].orderId}`);

                await rsmq.sendMessageAsync({ qname: process.env.SHIP_ORDER_QUEUE, message: JSON.stringify(orders[i]) });
            }
        }

        await setLastFetch();
    } catch (err) {
        console.log(err)
    } finally {
        process.exit();
    }
})();

async function setLastFetch() {
    let date = moment().toISOString();
    await redisClient.setAsync('lastShippedFetch', date);
}