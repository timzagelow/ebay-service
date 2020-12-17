require('dotenv').config();
const queue = require('./queue');

// (async() => {
    try {
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

