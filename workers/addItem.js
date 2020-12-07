const offer = require('../api/partner/offer');
const internalItem = require('../api/internal/item');
const inventoryItem = require('../api/partner/inventoryItem');
const buildInventoryItem = require('../builders/inventoryItem');
const DbItem = require('../models/Item');
const { handleApiError, handleError } = require('../errorHandler');
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

    const itemData = await internalItem.fetch(itemId);

    try {
        const payload = await buildInventoryItem(itemData);

        await inventoryItem.add(itemId, payload);
    } catch (error) {
        handleApiError(`Could not create item ${itemId}`, error);
    }

    try {
        if (dbItem.offerId) {
            await offer.update(dbItem.offerId, buildPayload(itemId, itemData));
        } else {
            dbItem.offerId = await offer.create(itemId, itemData);
            await dbItem.save();
        }
    } catch (error) {
        handleApiError(`Could not create/update offer for item ${itemId}`, error)
    }

    try {
        dbItem.listingId = await offer.publish(dbItem.offerId);
    } catch (error) {
        handleApiError(`Could not publish offer ${dbItem.offerId} for item ${itemId}`, error);
    }

    dbItem.status = 'active';

    return await dbItem.save();
}

module.exports = handle;