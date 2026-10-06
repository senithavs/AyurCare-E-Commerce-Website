import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      default: 'guest',
    },
    items: {
      type: Number,
      default: 1,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered'],
      default: 'pending',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    tracking: {
      type: String,
      default: null,
    },
    expectedDelivery: {
      type: Date,
      default: null,
    },
    customerName: {
      type: String,
      default: 'Customer',
    },
    shippingAddress: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
