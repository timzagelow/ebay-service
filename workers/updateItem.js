const offer = require('../api/partner/offer');
const store = require('../store/item');
const internalItem = require('../api/internal/item');
const inventoryItem = require('../api/partner/inventoryItem');
const buildInventoryItem = require('../builders/inventoryItem');
const offerBuilder = require('../builders/offer');
const getOfferId = require('../store/getOfferId');

async function handle(itemId, listingId) {
    const itemData = await internalItem.fetch(itemId);

    if (!itemData) {
        throw new Error(`Could not fetch item ${itemId} for update`);
    }

    const ebayListingId = await store.getEbayListingId(listingId);

    if (!ebayListingId) {
        throw new Error(`No eBay listingId exists for ${itemId}, ${listingId} to update`);
    }

    const payload = await buildInventoryItem(itemData, listingId);
    await inventoryItem.add(listingId, payload);
    const offerId = await getOfferId(listingId);

    if (!offerId) {
        throw new Error(`No offerId found for item ${itemId}, ${listingId}`);
    }

    const offerPayload = await offerBuilder(itemId, itemData, listingId);

    await offer.update(offerId, offerPayload);
}

module.exports = handle;