const removeItem = require('../workers/removeItem');

module.exports = async function(job) {
    await removeItem(job.itemId);
};