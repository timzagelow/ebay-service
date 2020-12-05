const axios = require('axios');

async function fetch(itemId) {
    const item = await axios.get(`${process.env.INVENTORY_API_URL}/inventory/${itemId}`);

    return item.data;
}

module.exports = { fetch };

