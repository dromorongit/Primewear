const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  wholesale_price: {
    type: Number,
    default: null,
    min: [0, 'Wholesale price cannot be negative']
  },
  retail_price: {
    type: Number,
    default: null,
    min: [0, 'Retail price cannot be negative']
  },
  sales_price: {
    type: Number,
    default: null,
    min: [0, 'Sales price cannot be negative']
  },
  short_description: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  long_description: {
    type: String,
    default: '',
    maxlength: [2000, 'Long description cannot exceed 2000 characters']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minimum_order_quantity: {
    type: Number,
    default: null,
    min: [1, 'Minimum order quantity must be at least 1']
  },
  categories: {
    type: [{
      type: String,
      enum: [
        'Clothings',
        'Accessories',
        'Premium Collection'
      ]
    }],
    default: []
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  sizes: {
    type: [String],
    default: []
  },
  colors: {
    type: [String],
    default: []
  },
  main_image: {
    type: String,
    default: ''
  },
  additional_images: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ name: 'text', short_description: 'text' });
productSchema.index({ categories: 1 });
productSchema.index({ is_featured: 1 });
productSchema.index({ wholesale_price: 1 });
productSchema.index({ retail_price: 1 });

module.exports = mongoose.model('Product', productSchema);
