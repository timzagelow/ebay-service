const axios = require('axios');
const logger = require('../../logger');

async function create(orderData) {
    try {
        const order = await axios.post(`${process.env.ORDERS_API_URL}/orders`, orderData);

        return order.data;
    } catch (err) {
        console.log(err.response.status);
        logger.error(`Could not create the order`, { error: err.response.data });

        throw Error;
    }
}

module.exports = { create };