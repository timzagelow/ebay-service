const shipmentBuilder = require('../builders/shipment');
const order = require('../api/partner/order');
const { handleError } = require('../errorHandler');

async function ship(orderId, ebayOrderId) {
    try {
        const payload = await shipmentBuilder(orderId);

        return await order.ship(ebayOrderId, payload);
    } catch (error) {
        handleError(`Could not ship eBay order ${orderId}`, error);
    }
}

module.exports = ship;