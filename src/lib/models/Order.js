import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [
      {
        id: String,
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      country: {
        type: String,
        default: 'Sri Lanka',
      },
    },
    subtotal: Number,
    tax: Number,
    deliveryFee: Number,
    total: Number,
    currency: {
      type: String,
      default: 'LKR',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentId: String,
    paymentMethod: {
      type: String,
      default: 'payhere',
    },
    paymentAmount: Number,
    paymentCurrency: String,
    notificationReceivedAt: Date,
    failedAt: Date,
    cancelledAt: Date,
    paidAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    notes: String,
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
let Order;
try {
  Order = mongoose.model('Order');
} catch {
  Order = mongoose.model('Order', orderSchema);
}

export default Order;
