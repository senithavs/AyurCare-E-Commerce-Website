import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      trim: true,
    },
    customer_id: {
      type: String,
      required: true,
      trim: true,
    },
    customer_name: {
      type: String,
      required: true,
      trim: true,
    },
    customer_email: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    verified_purchase: {
      type: Boolean,
      default: false,
    },
    helpful_count: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
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
let Review;
try {
  Review = mongoose.model('Review');
} catch {
  Review = mongoose.model('Review', reviewSchema);
}

export default Review;
