require('dotenv').config();

const defaults = require('./defaults');
const itemProcessor = require('./itemProcessor');
const orderProcessor = require('./orderProcessor');

const addItemHandler = require('../handlers/addItem');
const removeItemHandler = require('../handlers/removeItem');
const updateItemHandler = require('../handlers/updateItem');
const createOrderHandler = require('../handlers/createOrder');
const shipOrderHandler = require('../handlers/shipOrder');

const RSMQWorker = require('rsmq-worker');
const addItemWorker = new RSMQWorker(process.env.ADD_ITEM_QUEUE, defaults.workerSettings);
const removeItemWorker = new RSMQWorker(process.env.REMOVE_ITEM_QUEUE, defaults.workerSettings);
const updateItemWorker = new RSMQWorker(process.env.UPDATE_ITEM_QUEUE, defaults.workerSettings);
const createOrderWorker = new RSMQWorker(process.env.CREATE_ORDER_QUEUE, defaults.workerSettings);
const shipOrderWorker = new RSMQWorker(process.env.SHIP_ORDER_QUEUE, defaults.workerSettings);

async function init() {
    itemProcessor.init(addItemWorker, addItemHandler);
    itemProcessor.init(removeItemWorker, removeItemHandler);
    itemProcessor.init(updateItemWorker, updateItemHandler);

    orderProcessor.init(createOrderWorker, createOrderHandler);
    orderProcessor.init(shipOrderWorker, shipOrderHandler);
}

module.exports = { init };