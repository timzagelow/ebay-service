require('dotenv').config();
const queue = require('./queue');

(async() => {
    try {
        await queue.buildCacheQueue.add({}, {repeat: {cron: '*/15 * * * *'}});
        // await queue.itemQueue.add({ jobs: [
        //         { type: 'update', itemId: 765218 },
        //         // { type: 'remove', itemId: 577991 },
        //         // { type: 'remove', itemId: 717570 },
        //         // { type: 'remove', itemId: 152465 },
        //     ]});
    } catch (error) {
        console.log(error);
    }
})();

