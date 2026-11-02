import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
      default: '📦',
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Create indexes for better query performance
categorySchema.index({ isActive: 1 });
categorySchema.index({ name: 1, isActive: 1 });

// Prevent model recompilation
let Category;
try {
  Category = mongoose.model('Category');
} catch {
  Category = mongoose.model('Category', categorySchema);
}

export default Category;
