const DbItem = require('../models/Item');
const offer = require('../api/partner/offer');
const store = require('./item');

async function get(itemId) {
    let offerId = await store.getOfferId(itemId);

    let existingOfferId;

    if (!offerId) {
        // make sure an offer doesn't exist that we don't know about
        existingOfferId = await getOfferId(itemId);

        if (existingOfferId) {
            await saveExistingOfferId(itemId, existingOfferId);

            return existingOfferId;
        }
    }

    return offerId;
}

async function saveExistingOfferId(itemId, offerId) {
    let existing = await DbItem.findOne({ itemId: itemId });

    if (!existing) {
        existing = await DbItem.create({ itemId: itemId });
    }

    existing.offerId = offerId;
    await existing.save();
}

async function getOfferId(itemId) {
    const offers = await offer.getAll(itemId);

    if (offers && offers.length) {
        return offers[0].offerId;
    }
}

module.exports = get;