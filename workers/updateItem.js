const addOrUpdateItem = require('../jobs/addOrUpdateItem');
const offer = require('../api/partner/offer');
const store = require('../store/item');
const internalItem = require('../api/internal/item');
const offerBuilder = require('../../builders/offer');

async function handle(itemId) {
    const itemData = await internalItem.fetch(itemId);
    await addOrUpdateItem(itemId, itemData);

    const offerId = await store.getOfferId(itemId);
    const offerPayload = await offerBuilder(itemId, itemData);
    await offer.update(offerId, offerPayload);

    await store.update(itemId, { status: 'active' });
}

module.exports = handle;