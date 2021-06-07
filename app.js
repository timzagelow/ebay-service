require('dotenv').config();
const api = require('./api');
const ebayAuth = require('./ebayAuth');
const db = require('./db');
const auth = require('./auth');
const workers = require('./queue/workers');

(async() => {
    try {
        await db.load();
        await ebayAuth.getToken();
        await auth.getToken();

        api.init();

        await workers.init();
    } catch (err) {
        if (err.response && err.response.data) {
            console.log(err.response.data.message);
        }

        console.log(err);
    }
})();
