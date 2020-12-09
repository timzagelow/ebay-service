const addItem = require('../workers/addItem');

module.exports = async function(job) {
    await addItem(job.itemId);
};