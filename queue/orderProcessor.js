require('dotenv').config();
const RSMQWorker = require('rsmq-worker');
const defaults = require('./defaults');
const { handleError } = require('../errorHandler');

async function init(worker, handler) {
    worker.on( "message", async(msg, next, id) => {
        try {
            msg = JSON.parse(msg);
            
            // console.log(`processing ${id}`);

            await handler(msg);
        } catch (error) {
            handleError('Order processor error', error);
            console.log(error);
        } finally {
            next();
        }
    });

    worker.on('error', async (err, msg) => {
        console.log( 'error!', err, msg.id);
    });
}

module.exports = { init };