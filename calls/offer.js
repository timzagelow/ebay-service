const axios = require('axios');
const auth = require('../auth');

async function get(offerId) {
    try {
        const { data } = await axios.get(`${process.env.EBAY_API_URL}/sell/inventory/v1/offer/${offerId}`, config);

        return data;
    } catch (err) {
        // console.log(err);
        console.log(err.response.status);
        console.log(err.response.data);
    }
}

async function update(offerId, payload) {
    let offer = await get(offerId);

    for (let key in payload) {
        if (payload.hasOwnProperty(key)) {
            offer[key] = payload[key];
        }
    }

    const { data } = await axios.put(`${process.env.EBAY_API_URL}/sell/inventory/v1/offer/${offerId}`, offer, config);

    console.log(data);
}

async function publish(offerId) {
    try {
        const { data } = await axios.post(`${process.env.EBAY_API_URL}/sell/inventory/v1/offer/${offerId}/publish`, {}, config);

        console.dir(data, { depth: null });

        return data.listingId;
    } catch (err) {
        // console.log(err);
        console.log(err.response.status);
        console.log(err.response.data);
    }
}

async function withdraw(offerId) {
    try {
        const { data } = await axios.post(`${process.env.EBAY_API_URL}/sell/inventory/v1/offer/${offerId}/withdraw`, {}, config);

        console.dir(data, { depth: null });

        let listingId = data.listingId; // this will return if it was ended
    } catch (err) {
        // console.log(err);
        console.log(err.response.status);
        console.log(err.response.data);
    }
}

async function create(itemId) {
    try {
        let params = buildPayload(itemId);
        console.log(params);

        const { data } = await axios.post(`${process.env.EBAY_API_URL}/sell/inventory/v1/offer`, params, config);

        console.log(data);
        let offerId = data.offerId; // 7915524010
    } catch (err) {
        console.log(err.response.status);
        console.log(err.response.data);
    }
}

function buildPayload(itemId) {
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
        merchantLocationKey: '36e3', // LOCATION!
        pricingSummary: {
            price: {
                currency: "USD",
                value: "10"
            }
        }
    };
}

module.exports = { create, publish, get, update, withdraw };