const Queue = require('bull');

const addItemQueue = new Queue(process.env.EBAY_ADD_ITEM_QUEUE, process.env.REDIS_CONNECTION_STRING);
const updateItemQueue = new Queue(process.env.EBAY_UPDATE_ITEM_QUEUE, process.env.REDIS_CONNECTION_STRING);
const removeItemQueue = new Queue(process.env.EBAY_REMOVE_ITEM_QUEUE, process.env.REDIS_CONNECTION_STRING);
const getOrdersQueue = new Queue(process.env.EBAY_GET_ORDERS_QUEUE, process.env.REDIS_CONNECTION_STRING);
const shipOrderQueue = new Queue(process.env.EBAY_SHIP_ORDER_QUEUE, process.env.REDIS_CONNECTION_STRING);
const buildCacheQueue = new Queue(process.env.EBAY_BUILD_CACHE_QUEUE, process.env.REDIS_CONNECTION_STRING);

addItemQueue.process('./processors/addItem.js');
updateItemQueue.process('./processors/updateItem.js');
removeItemQueue.process('./processors/removeItem.js');
getOrdersQueue.process('./processors/getOrders.js');
shipOrderQueue.process('./processors/shipOrder.js');
buildCacheQueue.process('./processors/buildCache.js');

module.exports = {
    addItemQueue,
    updateItemQueue,
    removeItemQueue,
    getOrdersQueue,
    shipOrderQueue,
    buildCacheQueue,
};