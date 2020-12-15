const orderBuilder = require('../builders/order');
const orderItem = require('../api/internal/orderItem');
const ProcessedOrder = require('../models/ProcessedOrder');
const internalOrder = require('../api/internal/order');
const { handleApiError, handleError } = require('../errorHandler');
const logger = require('../logger');

async function create(order) {
    const existing = await ProcessedOrder.findOne({ ebayOrderId: order.orderId });

    if (!existing) {
        try {
            const payload = await orderBuilder(order);
            const created = await internalOrder.create(payload);

            const items = await orderItem.createMany(order);

            return await ProcessedOrder.create({
                orderId: created.id,
                ebayOrderId: order.orderId,
            });
        } catch (error) {
            handleApiError(`Could not create eBay order ${order.orderId}`, error);
        }
    }

    logger.warn(`Already processed order ${existing.orderId}`, existing._doc);
}

module.exports = create;