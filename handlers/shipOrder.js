const shipmentBuilder = require('../builders/shipment');
const orderApi = require('../api/partner/order');
const { handleError } = require('../errorHandler');

async function ship(order) {
    try {
        const orderId = order.orderId;
        const ebayOrderId = order.platform.orderId;

        const payload = await shipmentBuilder(orderId);

        return await orderApi.ship(ebayOrderId, payload);
    } catch (error) {
        handleError(`Could not ship eBay order ${order.orderId}`, error);
    }
}

module.exports = ship;