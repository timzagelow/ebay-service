const getOrders = require('../workers/getOrders');
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

        return await getOrders();
    } catch (error) {
        handleError('Error building cache', error);
    }

    return 'done';
};