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

    return item.offerId;
}

async function getListingId(itemId) {
    const item = await Item.findOne({ itemId: itemId }, 'listingId');

    return item.listingId;
}

module.exports = { update, getOfferId, getListingId };