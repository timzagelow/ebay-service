const offer = require('../api/partner/offer');
const internalItem = require('../api/internal/item');
const inventoryItem = require('../api/partner/inventoryItem');
const buildInventoryItem = require('../builders/inventoryItem');
const DbItem = require('../models/Item');
const buildPayload = require('../builders/offer');

async function handle(itemId, listingId) {
    const existing = await DbItem.findOne({ itemId: itemId, listingId: listingId });

    let dbItem;

    if (existing && existing.itemId && existing.listingId) {
        dbItem = existing;
    } else {
        dbItem = new DbItem({
            itemId: itemId,
            listingId: listingId,
        });
    }

    if (existing && existing.ebayListingId && existing.status === 'active') {
        throw new Error(`${itemId}, ${listingId} already exists. Not adding.`);
    }

    const itemData = await internalItem.fetch(itemId);
    const payload = await buildInventoryItem(itemData, listingId);
    await inventoryItem.add(listingId, payload);
    const existingOfferId = await getOfferId(listingId);

    if (existingOfferId) {
        dbItem.offerId = existingOfferId;
    }

    if (dbItem.offerId) {
        const offerPayload = await buildPayload(itemId, itemData, listingId);

        await offer.update(dbItem.offerId, offerPayload);
    } else {
        dbItem.offerId = await offer.create(listingId, itemData);
        await dbItem.save();
    }

    dbItem.ebayListingId = await offer.publish(dbItem.offerId);

    dbItem.status = 'active';

    return await dbItem.save();
}

async function getOfferId(listingId) {
    const offers = await offer.getAll(listingId);

    if (offers && offers.length) {
        return offers[0].offerId;
    }
}

module.exports = handle;