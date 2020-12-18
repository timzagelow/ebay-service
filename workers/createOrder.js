const orderBuilder = require('../builders/order');
const orderItem = require('../api/internal/orderItem');
const ProcessedOrder = require('../models/ProcessedOrder');
const internalOrder = require('../api/internal/order');
const { handleError } = require('../errorHandler');
const logger = require('../logger');

async function create(order) {
    const existing = await ProcessedOrder.findOne({ ebayOrderId: order.orderId });

    if (!existing) {
        try {
            const payload = await orderBuilder.build(order);

            const created = await internalOrder.create(payload);
            let orderId = created.id;

            await orderItem.createMany(orderId, order);

            return await ProcessedOrder.create({
                orderId: orderId,
                ebayOrderId: order.orderId,
            });

        } catch (error) {
            handleError(`Could not create eBay order ${order.orderId}`, error);
        }
    } else {
        logger.info(`Already processed order ${existing.orderId}`, existing._doc);
    }
}

module.exports = create;