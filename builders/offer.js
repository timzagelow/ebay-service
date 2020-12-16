const buildDescription = require('./description');
const buildItem = require('./item');

async function buildPayload(itemId, itemData, listingId) {
    buildItem.item = itemData;
    buildItem.listing = buildItem.getListing(listingId);
    const fulfillmentPolicyId = buildItem.mediaSize() === 'large' ? process.env.EBAY_LARGE_FULFILLMENT_POLICY_ID : process.env.EBAY_SMALL_FULFILLMENT_POLICY_ID;

    return {
        categoryId: process.env.EBAY_RECORDS_CATEGORY_ID,
        format: process.env.EBAY_LISTING_FORMAT,
        includeCatalogProductDetails: false,
        listingPolicies: {
            paymentPolicyId: process.env.EBAY_PAYMENT_POLICY_ID,
            returnPolicyId: process.env.EBAY_RETURN_POLICY_ID,
            fulfillmentPolicyId: fulfillmentPolicyId,
        },
        marketplaceId: process.env.EBAY_MARKETPLACE_ID,
        sku: listingId,
        merchantLocationKey: 'warehouse',
        pricingSummary: {
            price: {
                currency: "USD",
                value: buildItem.listing.price.toString()
            }
        },
        listingDescription: await buildDescription(itemData),
        storeCategoryNames: [ buildItem.genre() ],
    };
}

module.exports = buildPayload;