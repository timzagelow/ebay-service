const DbItem = require('../../models/Item');

async function createMany(order) {
    let items = order.lineItems;

    return await Promise.all(items.map(async item => {
        // get itemId from ItemDB
        const dbItem = await DbItem.find({ listingId: item.sku });

        if (!dbItem) {
            throw new Error(`Could not find listingId for ${item.sku}`);
        }

        let payload = {
            itemId: dbItem.itemId,
            listingId: item.sku,
            quantity: item.quantity,
            platform: getPlatformObject(item)
        };
        
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