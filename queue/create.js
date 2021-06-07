require('dotenv').config();
const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, ns: "rsmq"});

(async() => {
    try {
        await rsmq.createQueueAsync({ qname: process.env.ADD_ITEM_QUEUE });
        await rsmq.createQueueAsync({ qname: process.env.REMOVE_ITEM_QUEUE });
        await rsmq.createQueueAsync({ qname: process.env.UPDATE_ITEM_QUEUE });
        await rsmq.createQueueAsync({ qname: process.env.CREATE_ORDER_QUEUE });
        await rsmq.createQueueAsync({ qname: process.env.SHIP_ORDER_QUEUE });
    } catch(err) {
        console.log(err);
    }

    process.exit();
})();