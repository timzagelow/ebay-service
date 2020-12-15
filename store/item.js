const Item = require('../models/Item');

async function update(itemId, payload = {}) {
    let item = await Item.findOne({ itemId: itemId });

    if (!item) {
        payload.itemId = itemId;
        item = new Item(payload);
    } else {
        for (let key in payload) {
            if (payload.hasOwnProperty(key)) {
                item[key] = payload[key];
            }
        }
    }

    return await item.save();
}

async function getOfferId(itemId) {
    const item = await Item.findOne({ itemId: itemId }, 'offerId');

    if (item && item.offerId) {
        return item.offerId;
    }
}

async function getEbayListingId(itemId) {
    const item = await Item.findOne({ itemId: itemId }, 'ebayListingId');

    if (item && item.ebayListingId) {
        return item.ebayListingId;
    }
}

module.exports = { update, getOfferId, getEbayListingId };