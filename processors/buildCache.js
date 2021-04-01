const buildCache = require('../workers/buildCache');
const db = require('../db');
const { handleError } = require('../errorHandler');
const auth = require('../auth');
const api = require('../api');

module.exports = async function(job) {
    try {
        await db.load();
        await auth.getToken();

        api.init();

        return await buildCache();
    } catch (error) {
        handleError('Error building cache', error);
    }

    return 'done';
};