const axios = require('axios');
const moment = require('moment');

async function fetchNew(lastCheck) {
    let date = moment(lastCheck).utc().toISOString();

    const { data } = await axios.get(`${process.env.EBAY_API_URL}/sell/fulfillment/v1/order?filter=creationdate:[${date}]`);

    return data.orders;
}

async function fetch(orderId) {

}

async function refund(orderId, amount, reason) {

}

async function ship(orderId) {

}

module.exports = { fetchNew };