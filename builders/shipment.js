const internalOrder = require('../api/internal/order');

async function buildShipment(orderId) {
    const order = await internalOrder.fetch(orderId);

    return {
        lineItems: buildLineItems(order.items),
        shippedDate: order.shipping.shipments[0].date,
        trackingNumber: order.shipping.shipments[0].tracking,
    };
}

function buildLineItems(items) {
    return items.map(item => {
        return {
            lineItemId: item.platform.itemId,
            quantity: item.platform.quantity,
        }
    });
}

module.exports = buildShipment;