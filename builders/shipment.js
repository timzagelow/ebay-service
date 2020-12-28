const internalOrder = require('../api/internal/order');

async function buildShipment(orderId) {
    const order = await internalOrder.fetch(orderId);

    let carrierCode = order.shipping.shipments[0].tracking.includes('LTN') ? process.env.LANDMARK_SHIPPING_CARRIER_CODE : process.env.USPS_SHIPPING_CARRIER_CODE;

    return {
        lineItems: buildLineItems(order.items),
        shippedDate: order.shipping.shipments[0].date,
        trackingNumber: order.shipping.shipments[0].tracking,
        shippingCarrierCode: carrierCode,
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