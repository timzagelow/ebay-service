const axios = require('axios');

async function get(itemId) {
    try {
        const { data } = await axios.get(`${process.env.EBAY_API_URL}/sell/inventory/v1/inventory_item/${itemId}`);

        return data;
    } catch (err) {
        console.log(err.response.data);
    }
}

async function add(itemId, payload) {
    try {
        const { data } = await axios.put(`${process.env.EBAY_API_URL}/sell/inventory/v1/inventory_item/${itemId}`, payload);

        return data;
    } catch (err) {
        console.log(err.response.data);
    }
}

module.exports = { add, get };