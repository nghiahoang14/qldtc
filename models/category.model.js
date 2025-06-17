const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  parent: {
    type: Schema.Types.ObjectId,

    ref: 'Category', // tham chiếu đến chính nó
    default: null,
  }
}, {
  timestamps: true, // thêm createdAt và updatedAt nếu bạn muốn
});

module.exports = mongoose.model('Category', categorySchema);

