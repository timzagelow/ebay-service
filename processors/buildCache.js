const buildCache = require('../workers/buildCache');

module.exports = async function(job) {
    await buildCache();
};