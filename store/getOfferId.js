const DbItem = require('../models/Item');
const offer = require('../api/partner/offer');
const store = require('./item');

async function get(listingId) {
    let offerId = await store.getOfferId(listingId);

    let existingOfferId;

    if (!offerId) {
        // make sure an offer doesn't exist that we don't know about
        existingOfferId = await getOfferId(listingId);

        if (existingOfferId) {
            await saveExistingOfferId(listingId, existingOfferId);

            return existingOfferId;
        }
    }

    return offerId;
}

async function saveExistingOfferId(listingId, offerId) {
    let existing = await DbItem.findOne({ listingId: listingId });

    if (!existing) {
        existing = await DbItem.create({ listingId: listingId });
    }

    existing.offerId = offerId;
    await existing.save();
}

async function getOfferId(listingId) {
    const offers = await offer.getAll(listingId);

    if (offers && offers.length) {
        return offers[0].offerId;
    }
}

module.exports = get;