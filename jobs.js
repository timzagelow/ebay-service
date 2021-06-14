require('dotenv').config();
const db = require('./db');
const auth = require('./auth');
const api = require('./api');
const ebayAuth = require('./ebayAuth');
const buildCache = require('./jobs/buildCache');
const getOrders = require('./jobs/getOrders');
const getShippedOrders = require('./jobs/getShippedOrders');

(async() => {
    try {
        await db.load();
        await ebayAuth.getToken();
        await auth.getToken();

        api.init();

        await getOrders();
        await getShippedOrders();
        await buildCache();
    } catch(err) {
        console.log(err);
    } finally {
        process.exit();
    }
})();