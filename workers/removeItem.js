const inventoryItem = require('../api/partner/inventoryItem');
const offer = require('../api/partner/offer');
const store = require('../store/item');

async function handle(itemId) {
    await inventoryItem.remove(itemId);

    const offerId = await store.getOfferId(itemId);
    await offer.remove(offerId);

    await store.update(itemId, { status: 'inactive' });
}

module.exports = handle;