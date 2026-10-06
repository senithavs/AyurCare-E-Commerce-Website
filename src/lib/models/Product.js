import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    name_en: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    category_si: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'LKR',
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Pre-order'],
      default: 'In Stock',
    },
    product_benefits: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    product_image: {
      image_id: String,
      image_url: String,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    stock_quantity: {
      type: Number,
      default: 100,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent model recompilation
let Product;
try {
  Product = mongoose.model('Product');
} catch {
  Product = mongoose.model('Product', productSchema);
}

export default Product;
