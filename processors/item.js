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

    jobs.data.jobs.forEach(async (job) => {
        if (job.type === 'add') {
            console.log(`adding ${job.itemId}`);

            try {
                await addItem(job.itemId);
            } catch (error) {
                handleError(`Error adding item ${job.itemId}`, error);
            }
        }

        if (job.type === 'update') {
            console.log(`updating ${job.itemId}`);

            try {
                await updateItem(job.itemId);
            } catch (error) {
                handleError(`Error updating item ${job.itemId}`, error);
            }
        }

        if (job.type === 'remove') {
            console.log(`removing ${job.itemId}`);

            try {
                await removeItem(job.itemId);
            } catch (error) {
                handleError(`Error removing item ${job.itemId}`, error);
            }
        }
    });

    return 'done';
};