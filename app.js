const Queue = require('bull');
require('dotenv').config();
const db = require('./db');
const inventoryItem = require('./calls/inventoryItem');
const offer = require('./calls/offer');
const api = require('./api');
const item = require('./calls/item');
const itemStore = require('./store/item');

const addOrUpdateItem = require('./jobs/addOrUpdateItem');

(async() => {
    await db.load();
    api.init();

    try {
        let itemId = 16597;
        const itemData = await item.fetch(itemId);

        await addOrUpdateItem(itemId, itemData); // unless there's an error, create offer

        // await itemStore.update(itemId, { status: 'inactive' });

        // const offerId = await offer.create(itemId, itemData);
        // await itemStore.update(itemId, { offerId: offerId });

        // const listingId = await offer.publish(offerId);
        // await itemStore.update(itemId, { listingId: listingId, status: 'active' });

        // await offer.withdraw(offerId);

    } catch (err) {
        console.dir(err.response.data, { depth: null });
    }
})();


// setup job runner
// const ebayItemQueue = new Queue(process.env.EBAY_ITEM_QUEUE, process.env.REDIS_CONNECTION_STRING);
// ebayItemQueue.process(processor);