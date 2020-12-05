const buildDescription = require('../../builders/description');

async function buildPayload(itemId, itemData) {
    return {
        categoryId: process.env.EBAY_RECORDS_CATEGORY_ID,
        format: process.env.EBAY_LISTING_FORMAT,
        includeCatalogProductDetails: false,
        listingPolicies: {
            paymentPolicyId: process.env.EBAY_PAYMENT_POLICY_ID,
            returnPolicyId: process.env.EBAY_RETURN_POLICY_ID,
            fulfillmentPolicyId: process.env.EBAY_FULFILLMENT_POLICY_ID,
        },
        marketplaceId: process.env.EBAY_MARKETPLACE_ID,
        sku: itemId.toString(),
        merchantLocationKey: 'warehouse',
        pricingSummary: {
            price: {
                currency: "USD",
                value: itemData.price.toString()
            }
        },
        listingDescription: await buildDescription(itemData),
    };
}

module.exports = buildPayload;