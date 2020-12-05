const axios = require('axios');
const buildPayload = require('../../builders/offer');

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

    return data;
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

async function remove(offerId) {
    await axios.delete(`${process.env.EBAY_API_URL}/sell/inventory/v1/offer/${offerId}`, {});
}

module.exports = { create, publish, get, update, withdraw, remove };