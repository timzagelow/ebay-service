require('dotenv').config();
const RSMQWorker = require('rsmq-worker');
const defaults = require('./defaults');
const { handleError } = require('../errorHandler');

async function init(worker, handler) {
    worker.on( "message", async(msg, next, id) => {
        try {
            msg = JSON.parse(msg);
            
            console.log(`processing ${id}, item ${msg.itemId}`);

            await handler(msg.itemId, msg.listingId);
        } catch (error) {
            console.log(msg);
            
            if (error.response && error.response.config && error.response.config.data) {
                console.log(error.response.config.data);
            }
                        
            handleError(error, `item ${msg.itemId}, listing ${msg.listingId}`);
        } finally {
            next();
        }
    });

    worker.on('error', async (err, msg) => {
        console.log( 'error!', err, msg.id);
    });
}

module.exports = { init };