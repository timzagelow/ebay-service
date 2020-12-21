const getShippedOrders = require('../workers/getShippedOrders');
const db = require('../db');
const { handleError } = require('../errorHandler');
const auth = require('../auth');
const ebayAuth = require('../ebayAuth');
const api = require('../api');

module.exports = async function(job) {
    try {
        await db.load();
        await auth.getToken();
        await ebayAuth.getToken();

        api.init();

        return await getShippedOrders();
    } catch (error) {
        handleError('Error shipping orders', error);
    }

    return 'done';
};