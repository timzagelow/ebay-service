const mongoose = require('mongoose');
const { Schema } = mongoose;

const processedOrderSchema = new Schema({
    orderId: Number,
    ebayOrderId: String,
}, { timestamps: true });

const ProcessedOrder = mongoose.model('processed_order', processedOrderSchema);

module.exports = ProcessedOrder;