const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'BANK'],
    required: true
  },
  shippingMethod: {
    type: String,
    required: true
  },
  shippingAddress: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      name: String,
      image: String,
      quantity: Number,
      price: Number
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema, "orders");
