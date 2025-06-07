const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: String,
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', required: false 
  },
  image: String,
  stock: { 
    type: Number, 
    default: 0 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'out_of_stock'], 
    default: 'active' 
  },
  rating: {
    rate: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  deleted: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model("Product", productSchema, "products");
