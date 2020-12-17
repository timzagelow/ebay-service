const axios = require('axios');
const logger = require('../../logger');

async function create(orderData) {
    try {
        const order = await axios.post(`${process.env.ORDERS_API_URL}`, orderData);

        return order.data;
    } catch (err) {
        logger.error(`Could not create the order`, { error: err.response.data });

        throw Error;
    }
}

async function fetch(orderId) {
    try {
        const order = await axios.get(`${process.env.ORDERS_API_URL}/${orderId}`);

        return order.data;
    } catch (err) {
        logger.error(`Could not fetch the order`, { error: err.response.data });

        throw Error;
    }
}

async function update(orderId, orderData) {
    try {
        const order = await axios.put(`${process.env.ORDERS_API_URL}/${orderId}`, orderData);

        return order.data;
    } catch (err) {
        logger.error(`Could not update the order`, { error: err.response.data });

        throw Error;
    }
}

module.exports = { create, fetch, update };