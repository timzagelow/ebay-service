const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobErrorSchema = new Schema({
    message: String,
    error: {},
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const JobError = mongoose.model('job_error', jobErrorSchema);

module.exports = JobError;