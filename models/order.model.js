const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'BANK_TRANSFER'], 
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    shippingAddress: String,
    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            price: Number,
            quantity: Number
        }
    ],
    createdAt: Date
}, {
  timestamps: true 
});

module.exports = mongoose.model('Order', orderSchema, "orders");
