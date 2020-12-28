const Queue = require('bull');

const itemQueue = new Queue(process.env.EBAY_ITEM_QUEUE, process.env.REDIS_CONNECTION_STRING);
const getOrdersQueue = new Queue(process.env.EBAY_GET_ORDERS_QUEUE, process.env.REDIS_CONNECTION_STRING);
const shipOrderQueue = new Queue(process.env.EBAY_SHIP_ORDER_QUEUE, process.env.REDIS_CONNECTION_STRING);
const buildCacheQueue = new Queue(process.env.EBAY_BUILD_CACHE_QUEUE, process.env.REDIS_CONNECTION_STRING);

const ebayAuth = require('./ebayAuth');
const db = require('./db');
const auth = require('./auth');

const addItem = require('./workers/addItem');
const removeItem = require('./workers/removeItem');
const updateItem = require('./workers/updateItem');
const buildCache = require('./workers/buildCache');
const getOrders = require('./workers/getOrders');
const getShippedOrders = require('./workers/getShippedOrders');

const { handleError } = require('./errorHandler');
const api = require('./api');

(async() => {
    await db.load();
    await ebayAuth.getToken();
    await auth.getToken();

    api.init();

    shipOrderQueue.process(async() => {
        try {
            return await getShippedOrders();
        } catch (error) {
            handleError('Error shipping orders', error);
        }

        return Promise.resolve();
    });

    getOrdersQueue.process(async() => {
        try {
            return await getOrders();
        } catch (error) {
            handleError('Error getting new orders', error);
        }

        return Promise.resolve();
    });

    buildCacheQueue.process(async () => {
        try {
            return await buildCache();
        } catch (error) {
            handleError('Error building cache', error);
        }

        return Promise.resolve();
    });

    itemQueue.process(jobs => {
        console.log('processing jobs', jobs.data.jobs);

        jobs.data.jobs.forEach(async (job) => {
            if (job.type === 'add') {
                console.log(`adding ${job.itemId}, ${job.listingId}`);

                try {
                    await addItem(job.itemId, job.listingId);
                } catch (error) {
                    handleError(`Error adding item ${job.itemId}, ${job.listingId}`, error);
                }
            }

            if (job.type === 'update') {
                console.log(`updating ${job.itemId}`);

                try {
                    await updateItem(job.itemId, job.listingId);
                } catch (error) {
                    handleError(`Error updating item ${job.itemId}, ${job.listingId}`, error);
                }
            }

            if (job.type === 'remove') {
                console.log(`removing ${job.itemId}, ${job.listingId}`);

                try {
                    await removeItem(job.itemId, job.listingId);
                } catch (error) {
                    handleError(`Error removing item ${job.itemId}, ${job.listingId}`, error);
                }
            }
        });

        return Promise.resolve();
    });

})();



// const path = require('path');
// const appRoot = path.resolve(__dirname);
// itemQueue.process( appRoot + '/processors/item.js');
// getOrdersQueue.process( appRoot + '/processors/getOrders.js');
// shipOrderQueue.process(appRoot + '/processors/getShippedOrders.js');
// buildCacheQueue.process(1,appRoot + '/processors/buildCache.js');

module.exports = {
    itemQueue,
    getOrdersQueue,
    shipOrderQueue,
    buildCacheQueue,
};