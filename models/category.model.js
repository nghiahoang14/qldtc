const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category', 
    default: null,
  }
}, {
  timestamps: true, 
});

module.exports = mongoose.model('Category', categorySchema);
