require('dotenv').config();
const db = require('./db');
const api = require('./api');
const auth = require('./auth');
const ebayAuth = require('./ebayAuth');
const queue = require('./queue');

(async() => {
    // await db.load();
    // await auth.getToken();
    // await ebayAuth.getToken();

    // api.init();

    // setup job runner

    // try {
    //     queue.buildCacheQueue.add({});
    // } catch (error) {
    //     console.log(error);
    // }

})();

