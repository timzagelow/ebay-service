const axios = require('axios');
const logger = require('../../logger');

async function fetch(itemId) {
    try {
        const item = await axios.get(`${process.env.INVENTORY_API_URL}/${itemId}`);

        return item.data;
    } catch (err) {
        console.log(err.response);
        logger.error(`Could not fetch item data for item ${itemId}`, { error: err.response.data });

        throw Error;
    }
}

module.exports = { fetch };

