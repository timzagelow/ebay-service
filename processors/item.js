const addItem = require('../workers/addItem');
const removeItem = require('../workers/removeItem');
const updateItem = require('../workers/updateItem');
const db = require('../db');
const ebayAuth = require('../ebayAuth');
const api = require('../api');
const { handleError } = require('../errorHandler');

module.exports = async function(jobs) {
    await db.load();
    await ebayAuth.getToken();

    api.init();

    console.log('processing jobs', jobs.data.jobs);

    await asyncForEach(jobs.data.jobs, async (job) => {
    // jobs.data.jobs.forEach(async (job) => {
        if (job.type === 'add') {
            console.log(`adding ${job.itemId}, ${job.listingId}`);

            try {
                // await addItem(job.itemId, job.listingId);

            } catch (error) {
                handleError(`Error adding item ${job.itemId}, ${job.listingId}`, error);
            }
        }

        if (job.type === 'update') {
            console.log(`updating ${job.itemId}`);

            try {
                await updateItem(job.itemId, job.listingId);
            } catch (error) {
                handleError(`Error updating item ${job.itemId}, ${job.listingId}`, error);
            }
        }

        if (job.type === 'remove') {
            console.log(`removing ${job.itemId}, ${job.listingId}`);

            try {
                await removeItem(job.itemId, job.listingId);
            } catch (error) {
                handleError(`Error removing item ${job.itemId}, ${job.listingId}`, error);
            }
        }

        await delay(5000);

    });

    return 'done';
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}