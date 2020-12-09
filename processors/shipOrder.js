const shipOrder = require('../workers/shipOrder');

module.exports = async function(job) {
    await shipOrder(job.orderId);
};