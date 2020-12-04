const Queue = require('bull');
require('dotenv').config();
const processor = require('./jobs/processor');
const db = require('./db');
const cache = require('./workers/cache');
const inventoryItem = require('./calls/inventoryItem');
const offer = require('./calls/offer');
const api = require('./api');

const addItem = require('./jobs/addItem');

(async() => {
    await db.load();
    api.init();

    addItem(16597);

    // await offerItem(123);
    // const item = await inventoryItem.get(123);
    // console.log(item);
    // await offerItem.publish(7915524010);
    // await offerItem.withdraw(7915524010);
    // await offerItem.update(7915524010, { merchantLocationKey: 'warehouse' });
    // await offerItem.get(7915524010);
    // await cache.buildCache();
    // listingId = 110527211938

})();


// setup job runner
// const ebayItemQueue = new Queue(process.env.EBAY_ITEM_QUEUE, process.env.REDIS_CONNECTION_STRING);
// ebayItemQueue.process(processor);