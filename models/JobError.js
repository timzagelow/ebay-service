const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobErrorSchema = new Schema({
    message: String,
    error: {},
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const JobError = mongoose.model('JobError', jobErrorSchema);

module.exports = JobError;