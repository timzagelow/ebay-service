const Item = require('../models/Item');

async function update(listingId, payload = {}) {
    let item = await Item.findOne({ listingId: listingId });

    if (!item) {
        payload.listingId = listingId;
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

async function getOfferId(listingId) {
    const item = await Item.findOne({ listingId: listingId }, 'offerId');

    if (item && item.offerId) {
        return item.offerId;
    }
}

async function getEbayListingId(itemId, listingId) {
    const item = await Item.findOne({ itemId: itemId, listingId: listingId }, 'ebayListingId');

    if (item && item.ebayListingId) {
        return item.ebayListingId;
    }
}

module.exports = { update, getOfferId, getEbayListingId };