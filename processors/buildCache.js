const buildCache = require('../workers/buildCache');
const db = require('../db');

module.exports = async function(job) {
    await db.load();

    try {
        return await buildCache();
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};