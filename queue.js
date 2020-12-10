const Queue = require('bull');

const itemQueue = new Queue(process.env.EBAY_ITEM_QUEUE, process.env.REDIS_CONNECTION_STRING);
// const updateItemQueue = new Queue(process.env.EBAY_UPDATE_ITEM_QUEUE, process.env.REDIS_CONNECTION_STRING);
// const removeItemQueue = new Queue(process.env.EBAY_REMOVE_ITEM_QUEUE, process.env.REDIS_CONNECTION_STRING);
const getOrdersQueue = new Queue(process.env.EBAY_GET_ORDERS_QUEUE, process.env.REDIS_CONNECTION_STRING);
const shipOrderQueue = new Queue(process.env.EBAY_SHIP_ORDER_QUEUE, process.env.REDIS_CONNECTION_STRING);
const buildCacheQueue = new Queue(process.env.EBAY_BUILD_CACHE_QUEUE, process.env.REDIS_CONNECTION_STRING);

const path = require('path');
const appRoot = path.resolve(__dirname);

itemQueue.process(appRoot + '/processors/item.js');
getOrdersQueue.process(appRoot + '/processors/getOrders.js');
shipOrderQueue.process(appRoot + '/processors/shipOrder.js');
buildCacheQueue.process(appRoot + '/processors/buildCache.js');


module.exports = {
    itemQueue,
    getOrdersQueue,
    shipOrderQueue,
    buildCacheQueue,
};