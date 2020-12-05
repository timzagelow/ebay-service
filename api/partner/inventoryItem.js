const axios = require('axios');

async function get(itemId) {
    const { data } = await axios.get(`${process.env.EBAY_API_URL}/sell/inventory/v1/inventory_item/${itemId}`);

    return data;
}

async function add(itemId, payload) {
    const { data } = await axios.put(`${process.env.EBAY_API_URL}/sell/inventory/v1/inventory_item/${itemId}`, payload);

    return data;
}

async function remove(itemId) {
    await axios.delete(`${process.env.EBAY_API_URL}/sell/inventory/v1/inventory_item/${itemId}`);
}

module.exports = { add, get, remove };