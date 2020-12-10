const inventoryItem = require('../api/partner/inventoryItem');
const offer = require('../api/partner/offer');
const store = require('../store/item');
const getOfferId = require('../store/getOfferId');

async function handle(itemId) {
    //     await inventoryItem.remove(itemId);

    let offerId = await getOfferId(itemId);

    if (!offerId) {
        throw new Error(`No offerId found for item ${itemId}`);
    }

    await offer.withdraw(offerId);
    await store.update(itemId, { status: 'inactive' });
}

module.exports = handle;