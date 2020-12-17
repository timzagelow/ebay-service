const DbItem = require('../../models/Item');
const logger = require('../../logger');

async function createMany(orderId, order) {
    let items = order.lineItems;

    return await Promise.all(items.map(async item => {
        // get itemId from ItemDB
        const dbItem = await DbItem.findOne({ listingId: item.sku, status: 'active' });

        if (!dbItem) {
            throw new Error(`Could not find listingId for ${item.sku}`);
        }

        let payload = {
            itemId: dbItem.itemId,
            listingId: item.sku,
            quantity: item.quantity,
            platform: getPlatformObject(item)
        };

        try {
            const orderItem = await axios.post(`${process.env.ORDERS_API_URL}/${orderId}/item`, payload);

            if (orderItem && orderItem.data) {
                return orderItem.data;
            }
        } catch (err) {
            logger.error(`Could not create the order item`, { error: err });
            // throw Error;
        }
    }));
}

function getPlatformObject(item) {
    return {
        itemId: item.lineItemId,
        site: item.purchaseMarketplaceId,
        quantity: item.quantity,
        price: parseFloat(item.lineItemCost.value),
        shippingCost: parseFloat(item.deliveryCost.shippingCost.value),
        shipByDate: item.lineItemFulfillmentInstructions.shipByDate,
        tax: getTaxTotal(item),
    };
}

function getTaxTotal(item) {
    let taxTotal = 0;

    item.taxes.forEach(tax => {
        taxTotal += parseFloat(tax.amount.value);
    });

    return taxTotal;
}

module.exports = { createMany };