const addOrUpdateItem = require('../jobs/addOrUpdateItem');
const offer = require('../api/partner/offer');
const store = require('../store/item');
const internalItem = require('../api/internal/item');
const DbItem = require('../models/Item');

async function handle(itemId) {
    const itemData = await internalItem.fetch(itemId);
    await addOrUpdateItem(itemId, itemData);

    const offerId = await offer.create(itemId, itemData);
    const listingId = await offer.publish(offerId);

    const dbItem = await DbItem.create({
        itemId: itemId,
        offerId: offerId,
        listingId: listingId,
        status: 'active'
    });

    return await dbItem.save();
}

module.exports = handle;