/**
 * Seed Orders Script
 * Creates 10 sample orders in the database
 * Run: node scripts/seed-orders.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, default: 'guest' },
  items: { type: Number, default: 1 },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  date: { type: Date, default: Date.now },
  tracking: { type: String, default: null },
  expectedDelivery: { type: Date, default: null },
  customerName: { type: String, default: 'Customer' },
  shippingAddress: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

const mockOrders = [
  {
    orderId: 'ORD-001',
    userId: 'user-1',
    items: 2,
    amount: 2850,
    status: 'delivered',
    date: new Date('2026-09-15'),
    tracking: 'TRACK-2026-001',
    expectedDelivery: new Date('2026-09-20'),
    customerName: 'Priya Kumar',
    shippingAddress: '123 Main St, Mumbai, Maharashtra',
    paymentStatus: 'completed',
  },
  {
    orderId: 'ORD-002',
    userId: 'user-2',
    items: 1,
    amount: 1450,
    status: 'shipped',
    date: new Date('2026-09-18'),
    tracking: 'TRACK-2026-002',
    expectedDelivery: new Date('2026-09-25'),
    customerName: 'Rajesh Singh',
    shippingAddress: '456 Oak Ave, Delhi, Delhi',
    paymentStatus: 'completed',
  },
  {
    orderId: 'ORD-003',
    userId: 'user-3',
    items: 3,
    amount: 4200,
    status: 'processing',
    date: new Date('2026-09-20'),
    tracking: 'TRACK-2026-003',
    expectedDelivery: new Date('2026-09-27'),
    customerName: 'Amelia Torres',
    shippingAddress: '789 Pine Rd, Bangalore, Karnataka',
    paymentStatus: 'completed',
  },
  {
    orderId: 'ORD-004',
    userId: 'user-1',
    items: 1,
    amount: 1890,
    status: 'delivered',
    date: new Date('2026-09-10'),
    tracking: 'TRACK-2026-004',
    expectedDelivery: new Date('2026-09-15'),
    customerName: 'Deepak Patel',
    shippingAddress: '321 Elm St, Pune, Maharashtra',
    paymentStatus: 'completed',
  },
  {
    orderId: 'ORD-005',
    userId: 'user-4',
    items: 2,
    amount: 3100,
    status: 'pending',
    date: new Date('2026-09-22'),
    tracking: null,
    expectedDelivery: new Date('2026-09-29'),
    customerName: 'Sneha Sharma',
    shippingAddress: '654 Birch Ln, Hyderabad, Telangana',
    paymentStatus: 'completed',
  },
  {
    orderId: 'ORD-006',
    userId: 'user-5',
    items: 4,
    amount: 5250,
    status: 'shipped',
    date: new Date('2026-09-19'),
    tracking: 'TRACK-2026-006',
    expectedDelivery: new Date('2026-09-26'),
    customerName: 'Vikram Desai',
    shippingAddress: '987 Cedar St, Ahmedabad, Gujarat',
    paymentStatus: 'completed',
  },
  {
    orderId: 'ORD-007',
    userId: 'user-2',
    items: 1,
    amount: 2100,
    status: 'delivered',
    date: new Date('2026-09-12'),
    tracking: 'TRACK-2026-007',
    expectedDelivery: new Date('2026-09-17'),
    customerName: 'Neha Kapoor',
    shippingAddress: '147 Maple Ave, Kolkata, West Bengal',
    paymentStatus: 'completed',
  },
  {
    orderId: 'ORD-008',
    userId: 'user-6',
    items: 2,
    amount: 2450,
    status: 'processing',
    date: new Date('2026-09-21'),
    tracking: 'TRACK-2026-008',
    expectedDelivery: new Date('2026-09-28'),
    customerName: 'Arjun Singh',
    shippingAddress: '258 Walnut Rd, Lucknow, Uttar Pradesh',
    paymentStatus: 'completed',
  },
  {
    orderId: 'ORD-009',
    userId: 'user-3',
    items: 1,
    amount: 1630,
    status: 'delivered',
    date: new Date('2026-09-08'),
    tracking: 'TRACK-2026-009',
    expectedDelivery: new Date('2026-09-13'),
    customerName: 'Meera Gupta',
    shippingAddress: '369 Spruce Ct, Jaipur, Rajasthan',
    paymentStatus: 'completed',
  },
  {
    orderId: 'ORD-010',
    userId: 'user-4',
    items: 3,
    amount: 3760,
    status: 'shipped',
    date: new Date('2026-09-17'),
    tracking: 'TRACK-2026-010',
    expectedDelivery: new Date('2026-09-24'),
    customerName: 'Pooja Rao',
    shippingAddress: '741 Oak Cir, Surat, Gujarat',
    paymentStatus: 'completed',
  },
];

async function seedOrders() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined in .env.local');
    }

    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB Connected');

    // Clear existing orders
    await Order.deleteMany({});
    console.log('✓ Cleared existing orders');

    // Insert mock orders
    const createdOrders = await Order.insertMany(mockOrders);
    console.log(`✓ Created ${createdOrders.length} orders`);

    // Verify
    const count = await Order.countDocuments({});
    console.log(`✓ Total orders in database: ${count}`);

    console.log('\n📊 Order Summary:');
    mockOrders.forEach((order) => {
      console.log(
        `  ${order.orderId}: Rs. ${order.amount} - ${order.status} - ${order.customerName}`
      );
    });

    await mongoose.disconnect();
    console.log('\n✓ Seeding complete and disconnected');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error.message);
    process.exit(1);
  }
}

seedOrders();
