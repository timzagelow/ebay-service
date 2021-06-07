const redisClient = require('../redisClient');
const moment = require('moment');
const createOrder = require('../handlers/createOrder');
const apiOrder = require('../api/partner/order');
const { handleError } = require('../errorHandler');
const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, ns: "rsmq"});
const db = require('../db');
const auth = require('../auth');
const ebayAuth = require('../ebayAuth');
const api = require('../api');

(async() => {
    try {
        await db.load();
        await ebayAuth.getToken();
        await auth.getToken();
        api.init();

        const lastOrdersFetch = await redisClient.getAsync('lastOrdersFetch');

        const orders = await apiOrder.fetchNew(lastOrdersFetch);

        for (let i = 0; i < orders.length; i++) {
            await rsmq.sendMessageAsync({ qname: process.env.CREATE_ORDER_QUEUE, message: JSON.stringify(orders[i]) });
        }

        await setLastFetch();
    } catch (err) {
        console.log(err);
        handleError(`Error retrieving orders`, err);
    } finally {
        process.exit();
    }

})();

async function setLastFetch() {
    let date = moment().subtract(12, 'hours').toISOString();
    await redisClient.setAsync('lastOrdersFetch', date);
}