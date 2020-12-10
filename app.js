require('dotenv').config();
const queue = require('./queue');

(async() => {
    try {
        await queue.buildCacheQueue.add({}, {repeat: {cron: '*/15 * * * *'}});
    } catch (error) {
        console.log(error);
    }
})();

