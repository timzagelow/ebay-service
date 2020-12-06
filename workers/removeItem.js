const inventoryItem = require('../api/partner/inventoryItem');
const offer = require('../api/partner/offer');
const store = require('../store/item');
const logger = require('../logger');
const { handleError, handleApiError } = require('../errorHandler');

async function handle(itemId) {
    // try {
    //     await inventoryItem.remove(itemId);
    // } catch (error) {
    //     if (error.response.status === 404) {
    //         logger.warn(`Item ${itemId} not found when trying to remove.`, { errors: error.response.data.errors });
    //     } else {
    //         handleApiError(`Could not remove inventory item ${itemId}`, error);
    //     }
    // }

    const offerId = await store.getOfferId(itemId);

    if (!offerId) {
        logger.warn(`No offerId found for item ${itemId}`);
    } else {
        try {
            await offer.withdraw(offerId);
        } catch (error) {
            if (error.response.status === 404) {
                logger.warn(`Offer ${offerId} for item ${itemId} not found when trying to withdraw.`, { errors: error.response.data.errors });
            } else {
                handleApiError(`Could not withdraw offer ${offerId} for item ${itemId}`, error);
            }
        }
    }

    // only set to inactive if we deleted inventory item AND offer
    await store.update(itemId, { status: 'inactive' });
}

module.exports = handle;