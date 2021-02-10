require('dotenv').config();
const queue = require('./queue');
const db = require('./db');
const JobError = require('./models/JobError');

(async() => {
    await db.load();

    const errors = await JobError.find({ error: { $elemMatch: { message: 'A system error has occurred.'}}}).limit(10);
    let jobs = [];

    errors.forEach(async error => {
        let split = error.message.split('Error adding item ');
        let secondSplit = split[1];
        let thirdSplit = secondSplit.split(', ');
        let itemId = thirdSplit[0];
        let fourthSplit = thirdSplit[1].split(' - ');
        let listingId = fourthSplit[0];

        console.log(error._id);

        // add message
        jobs.push({ type: 'add', itemId: itemId, listingId: listingId });

        await JobError.remove({ _id: error._id });
        // remove error from job_errors
});
    console.log(jobs);
})();