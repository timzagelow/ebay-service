const axios = require('axios');
const logger = require('../../logger');

async function create(customerData) {
    try {
        const customer = await axios.post(`${process.env.ORDERS_API_URL}/customers`, customerData);

        return customer.data;
    } catch (err) {
        logger.error(`Could not create the customer`, { error: err.response.data });

        throw Error;
    }
}

async function update(id, customerData) {
    try {
        const customer = await axios.put(`${process.env.ORDERS_API_URL}/customers/${id}`, customerData);

        return customer.data;
    } catch (err) {
        logger.error(`Could not update the customer`, { error: err.response.data });

        throw Error;
    }
}

async function updateAddress(id, customerData) {
    try {
        const customer = await axios.post(`${process.env.ORDERS_API_URL}/customers/${id}/address`, customerData);

        return customer.data;
    } catch (err) {
        logger.error(`Could not update the customer`, { error: err.response.data });

        throw Error;
    }
}

async function fetchByEmail(email) {
    try {
        const customer = await axios.get(`${process.env.ORDERS_API_URL}/customers?email=${email}`);

        if (customer && customer.data) {
            return customer.data;
        }
    } catch (err) {
        logger.error(`Could not fetch the customer`, { error: err });

        throw Error;
    }
}

module.exports = { create, fetchByEmail, update, updateAddress };