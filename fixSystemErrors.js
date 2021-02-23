require('dotenv').config();
const queue = require('./queue');
const db = require('./db');
const JobError = require('./models/JobError');

(async() => {
    await db.load();

    const errors = await JobError.find({ error: { $elemMatch: { message: 'A system error has occurred.'}}}).limit(1).sort({ createdAt: -1 });

    let jobs = [];
    let deletes = [];

    errors.forEach(async error => {
        if (error.message.indexOf('Error adding item') !== -1) {
            let split = error.message.split('Error adding item ');
            let secondSplit = split[1];
            let thirdSplit = secondSplit.split(', ');
            let itemId = thirdSplit[0];
            let fourthSplit = thirdSplit[1].split(' - ');
            let listingId = fourthSplit[0];

            console.log(error._id);

            jobs.push({type: 'add', itemId: itemId, listingId: listingId});
            deletes.push(JobError.deleteOne({_id: error._id}));
        }
});

    console.log(jobs);

    queue.itemQueue.add({ jobs: jobs });

    if (deletes.length) {
        await Promise.all(deletes);
    }
})();
