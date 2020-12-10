const buildCache = require('../workers/buildCache');
const db = require('../db');
const { handleError } = require('../errorHandler');

module.exports = async function(job) {
    await db.load();

    try {
        return await buildCache();
    } catch (error) {
        handleError('Error building cache', error);
    }

    return 'done';
};