const getOrders = require('../workers/getOrders');

module.exports = async function(job) {
    await getOrders();
};