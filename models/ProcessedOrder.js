const mongoose = require('mongoose');
const { Schema } = mongoose;

const processedOrderSchema = new Schema({
    orderId: Number,
    ebayOrderId: String,
}, { timestamps: true });

const ProcessedOrder = mongoose.model('ProcessedOrder', processedOrderSchema);

module.exports = ProcessedOrder;