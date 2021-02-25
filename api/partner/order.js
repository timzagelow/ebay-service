const axios = require('axios');
const moment = require('moment');

async function fetchNew(lastCheck) {
    let date = moment(lastCheck).toISOString();

    const { data } = await axios.get(`${process.env.EBAY_API_URL}/sell/fulfillment/v1/order?limit=500&filter=creationdate:%5B${date}..%5D`);

    if (data.orders) {
        return data.orders;
    }
}

async function fetch(orderId) {

}

async function refund(orderId, amount, reason) {

}

async function ship(orderId, payload) {
    const { data } = await axios.post(`${process.env.EBAY_API_URL}/sell/fulfillment/v1/order/${orderId}/shipping_fulfillment`, payload);

    return data;
}

module.exports = { fetchNew, ship };