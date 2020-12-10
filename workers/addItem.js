const offer = require('../api/partner/offer');
const internalItem = require('../api/internal/item');
const inventoryItem = require('../api/partner/inventoryItem');
const buildInventoryItem = require('../builders/inventoryItem');
const DbItem = require('../models/Item');
const buildPayload = require('../builders/offer');

async function handle(itemId) {
    const existing = await DbItem.findOne({ itemId: itemId });

    let dbItem;

    if (existing && existing.itemId) {
        dbItem = existing;
    } else {
        dbItem = new DbItem({
            itemId: itemId,
        });
    }

    if (existing && existing.listingId && existing.status === 'active') {
        throw new Error(`${itemId} already exists. Not adding.`);
    }

    const itemData = await internalItem.fetch(itemId);
    const payload = await buildInventoryItem(itemData);
    await inventoryItem.add(itemId, payload);
    const existingOfferId = await getOfferId(itemId);

    if (existingOfferId) {
        dbItem.offerId = existingOfferId;
    }

    if (dbItem.offerId) {
        const offerPayload = await buildPayload(itemId, itemData);
        console.dir(offerPayload, { depth: null });

        await offer.update(dbItem.offerId, offerPayload);
    } else {
        dbItem.offerId = await offer.create(itemId, itemData);
        await dbItem.save();
    }

    dbItem.listingId = await offer.publish(dbItem.offerId);

    dbItem.status = 'active';

    return await dbItem.save();
}

async function getOfferId(itemId) {
    const offers = await offer.getAll(itemId);

    if (offers && offers.length) {
        return offers[0].offerId;
    }
}

module.exports = handle;