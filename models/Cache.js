const mongoose = require('mongoose');
const { Schema } = mongoose;

const cacheSchema = new Schema({
    itemId: Number,
    encodedItem: String,
});

const Cache = mongoose.model('Cache', cacheSchema);

module.exports = Cache;