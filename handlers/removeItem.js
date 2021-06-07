const inventoryItem = require('../api/partner/inventoryItem');
const offer = require('../api/partner/offer');
const store = require('../store/item');
const getOfferId = require('../store/getOfferId');

async function handle(itemId, listingId) {
    //     await inventoryItem.remove(itemId);

    let offerId = await getOfferId(listingId);

    if (!offerId) {
        throw new Error(`No offerId found for item ${itemId}, ${listingId}`);
    }

    await offer.withdraw(offerId);
    await store.update(listingId, { status: 'inactive' });
}

module.exports = handle;