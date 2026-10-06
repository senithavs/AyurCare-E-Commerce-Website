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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // Order Items
    items: [
      {
        id: String,
        name: String,
        quantity: Number,
        price: Number,
        _id: false,
      },
    ],
    // Customer Information
    customer: {
      firstName: String,
      lastName: String,
      email: {
        type: String,
        lowercase: true,
      },
      phone: String,
      address: String,
      country: {
        type: String,
        default: 'Sri Lanka',
      },
      _id: false,
    },
    // Order Amount Details
    subtotal: Number,
    tax: Number,
    deliveryFee: {
      type: Number,
      default: 350,
    },
    total: Number,
    currency: {
      type: String,
      default: 'LKR',
    },
    // Order Status
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'],
      default: 'pending',
      index: true,
    },
    // Payment Status
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
    // Order Progress Timeline
    progressTimeline: [
      {
        status: String,
        description: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: String,
        _id: false,
      },
    ],
    // Order Timestamps
    notificationReceivedAt: Date,
    failedAt: Date,
    cancelledAt: Date,
    paidAt: Date,
    processingAt: Date,
    shippedAt: {
      type: Date,
      description: 'When order was shipped',
    },
    deliveredAt: {
      type: Date,
      description: 'When order was delivered',
    },
    // Shipping Details (optional)
    shipping: {
      trackingNumber: String,
      carrier: String,
      estimatedDelivery: Date,
      actualDelivery: Date,
      _id: false,
    },
    // Order Notes and History
    notes: String,
    internalNotes: [
      {
        note: String,
        addedBy: String,
        addedAt: {
          type: Date,
          default: Date.now,
        },
        _id: false,
      },
    ],
    // Return/Refund Information
    returnStatus: {
      type: String,
      enum: ['none', 'requested', 'approved', 'completed', 'rejected'],
      default: 'none',
    },
    returnReason: String,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['none', 'pending', 'completed', 'failed'],
      default: 'none',
    },
    // Discount Information
    discountCode: String,
    discountAmount: Number,
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
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
