require('dotenv').config();
const queue = require('./queue');
const api = require('./api');
const ebayAuth = require('./ebayAuth');
const db = require('./db');
const auth = require('./auth');
const { handleError } = require('./errorHandler');

(async() => {
    await db.load();
    await ebayAuth.getToken();
    await auth.getToken();

    api.init();
})();


// (async() => {
    try {

        queue.buildCacheQueue.resume();

        queue.getOrdersQueue.on('stalled', (job, error) => {
            console.log(error);
            handleError(`getOrdersQueue ${job.id} stalled`, error);
        });

        queue.buildCacheQueue.on('stalled', (job, error) => {
            console.log(error);
            handleError(`buildCacheQueue ${job.id} stalled`, error);
        });

        queue.shipOrderQueue.on('stalled', (job, error) => {
            console.log(error);
            handleError(`shipOrderQueue ${job.id} stalled`, error);
        });

        // queue.getOrdersQueue.add({});
        // queue.buildCacheQueue.add({}, { removeOnComplete: true, removeOnFail: true, limit: 1, repeat: {cron: '0 */2 * * * *'}});        // await queue.buildCacheQueue.pause();

        // await queue.itemQueue.add({ jobs: [
        //         { type: 'add', itemId: 680290, listingId: "5fd81578be3a8e0d7fc2454f" },
        //         // { type: 'remove', itemId: 577991 },
        //         // { type: 'remove', itemId: 717570 },
        //         // { type: 'remove', itemId: 152465 },
        //     ]});
    } catch (error) {
        console.log(error);
    }
// })();

