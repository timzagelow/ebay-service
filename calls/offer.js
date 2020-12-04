const axios = require('axios');
const buildDescription = require('../builders/description');

async function get(offerId) {
    const { data } = await axios.get(`${process.env.EBAY_API_URL}/sell/inventory/v1/offer/${offerId}`);

    return data;
}

async function update(offerId, payload) {
    let offer = await get(offerId);

    for (let key in payload) {
        if (payload.hasOwnProperty(key)) {
            offer[key] = payload[key];
        }
    }

    const { data } = await axios.put(`${process.env.EBAY_API_URL}/sell/inventory/v1/offer/${offerId}`, offer);
}

async function publish(offerId) {
        const { data } = await axios.post(`${process.env.EBAY_API_URL}/sell/inventory/v1/offer/${offerId}/publish`, {});

        return data.listingId;
}

async function withdraw(offerId) {
    const { data } = await axios.post(`${process.env.EBAY_API_URL}/sell/inventory/v1/offer/${offerId}/withdraw`, {});

    if (data.listingId) {
        return data.listingId;
    }
}

async function create(itemId, itemData) {
    let params = await buildPayload(itemId, itemData);

    const { data } = await axios.post(`${process.env.EBAY_API_URL}/sell/inventory/v1/offer`, params);

    if (data.offerId) {
        return data.offerId;
    }
}

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

module.exports = { create, publish, get, update, withdraw };