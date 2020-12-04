
module.exports = function(job) {
    // Do some heavy work
    console.log(job.data)
    return Promise.reject('ack');
};