const offer = require('../api/partner/offer');
const store = require('../store/item');
const internalItem = require('../api/internal/item');
const inventoryItem = require('../api/partner/inventoryItem');
const buildInventoryItem = require('../builders/inventoryItem');
const offerBuilder = require('../builders/offer');
const getOfferId = require('../store/getOfferId');

async function handle(itemId) {
    const itemData = await internalItem.fetch(itemId);

    if (!itemData) {
        throw new Error(`Could not fetch item ${itemId} for update`);
    }

    const listingId = await store.getListingId(itemId);

    if (!listingId) {
        throw new Error(`No listingId exists for ${itemId} to update`);
    }

    const payload = await buildInventoryItem(itemData);
    await inventoryItem.add(itemId, payload);
    const offerId = await getOfferId(itemId);

    if (!offerId) {
        throw new Error(`No offerId found for item ${itemId}`);
    }

    const offerPayload = await offerBuilder(itemId, itemData);

    await offer.update(offerId, offerPayload);
}

module.exports = handle;