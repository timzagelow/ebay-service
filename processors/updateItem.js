const updateItem = require('../workers/updateItem');

module.exports = async function(job) {
    await updateItem(job.itemId);
};