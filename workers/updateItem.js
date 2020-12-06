const addOrUpdateItem = require('../jobs/addOrUpdateItem');
const offer = require('../api/partner/offer');
const store = require('../store/item');
const internalItem = require('../api/internal/item');
const offerBuilder = require('../builders/offer');
const { handleApiError, handleError } = require('../errorHandler');

async function handle(itemId) {
    const itemData = await internalItem.fetch(itemId);

    if (!itemData) {
        handleError(`Could not fetch item ${itemId}`);
    }

    try {
        await addOrUpdateItem(itemId, itemData);
    } catch (error) {
        handleApiError(`Could not update item ${itemId}`, error);
    }

    const offerId = await store.getOfferId(itemId);

    if (!offerId) {
        handleApiError(`Can't update because no offer exists for item ${itemId}.`);
    }

    const offerPayload = await offerBuilder(itemId, itemData);

    try {
        await offer.update(offerId, offerPayload);
    } catch (error) {
        handleError(`Could not update offer ${offerId} for item ${itemId}`, error);
    }

    // await store.update(itemId, { status: 'active' });
}

module.exports = handle;