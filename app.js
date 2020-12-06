const Queue = require('bull');
require('dotenv').config();
const db = require('./db');
const api = require('./api');
const logger = require('./logger');
const removeItem = require('./workers/removeItem');
const addItem = require('./workers/addItem');
const updateItem = require('./workers/updateItem');
const offer = require('./api/partner/offer');
const DbItem = require('./models/Item');

(async() => {
    await db.load();
    api.init();

    try {
        let itemId = 149389;

        await updateItem(itemId);
        logger.info(`Updated item ${itemId}`);
    } catch (err) {
        // console.dir(err, { depth: null });

        // console.dir(err.response.data, { depth: null });
    }
})();


// setup job runner
// const ebayItemQueue = new Queue(process.env.EBAY_ITEM_QUEUE, process.env.REDIS_CONNECTION_STRING);
// ebayItemQueue.process(processor);