# Order Tracking & Management Guide

Complete documentation for order details and progress tracking in AyurCare.

---

## Overview

All order details and progress are now stored in MongoDB with comprehensive tracking capabilities:

- ✅ Complete order history
- ✅ Order progress timeline
- ✅ Payment status tracking
- ✅ Shipping information
- ✅ Delivery tracking
- ✅ Return/Refund management
- ✅ Admin order management

---

## Order Schema in MongoDB

### Complete Order Structure

```javascript
{
  _id: ObjectId,
  
  // Identifiers
  orderId: String (unique),        // "ORD-20261005-ABC123"
  userId: ObjectId (ref: User),    // Link to user account
  
  // Items
  items: [
    {
      id: String,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  
  // Customer Information
  customer: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    country: String
  },
  
  // Amount Details
  subtotal: Number,
  tax: Number,
  deliveryFee: Number,
  total: Number,
  currency: String,
  discountCode: String,
  discountAmount: Number,
  
  // Order Status
  status: String (enum: pending|paid|processing|shipped|delivered|cancelled|failed),
  
  // Payment Status
  paymentStatus: String (enum: pending|completed|failed|cancelled),
  paymentId: String,
  paymentMethod: String,
  paymentAmount: Number,
  
  // Progress Timeline
  progressTimeline: [
    {
      status: String,
      description: String,
      timestamp: Date,
      notes: String
    }
  ],
  
  // Status Timestamps
  paidAt: Date,
  processingAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  failedAt: Date,
  
  // Shipping Details
  shipping: {
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  
  // Internal Notes (Admin Only)
  notes: String,
  internalNotes: [
    {
      note: String,
      addedBy: String,
      addedAt: Date
    }
  ],
  
  // Return/Refund
  returnStatus: String (enum: none|requested|approved|completed|rejected),
  returnReason: String,
  refundAmount: Number,
  refundStatus: String (enum: none|pending|completed|failed),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Get User's Orders

**GET /api/orders/user**

```javascript
// Headers
x-user-id: "507f1f77bcf86cd799439011"

// Query Parameters
?status=paid              // Filter by status
?sort=-createdAt          // Sort (default: newest first)
?limit=50                 // Items per page
?skip=0                   // Pagination offset
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "orderId": "ORD-20261005-ABC123",
      "status": "shipped",
      "total": 5350,
      "createdAt": "2026-10-05T15:30:00Z",
      "progressPercentage": 75,
      "progressTimeline": [...]
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 50,
    "skip": 0,
    "pages": 1
  }
}
```

---

### Get Order Details

**GET /api/orders/[orderId]**

```javascript
// Example: GET /api/orders/ORD-20261005-ABC123
```

**Response:**
```json
{
  "success": true,
  "order": {
    "orderId": "ORD-20261005-ABC123",
    "status": "shipped",
    "paymentStatus": "completed",
    "items": [...],
    "customer": {...},
    "total": 5350,
    "progressTimeline": [
      {
        "status": "pending",
        "description": "Order received and awaiting payment",
        "timestamp": "2026-10-05T15:30:00Z"
      },
      {
        "status": "paid",
        "description": "Payment received, order processing",
        "timestamp": "2026-10-05T15:35:00Z"
      },
      {
        "status": "processing",
        "description": "Order being prepared for shipment",
        "timestamp": "2026-10-05T16:00:00Z"
      },
      {
        "status": "shipped",
        "description": "Order has been shipped",
        "timestamp": "2026-10-05T17:30:00Z",
        "notes": "Tracking: ABC123456"
      }
    ],
    "shipping": {
      "trackingNumber": "ABC123456",
      "carrier": "FedEx",
      "estimatedDelivery": "2026-10-10T00:00:00Z"
    }
  },
  "progressPercentage": 75
}
```

---

### Update Order Progress

**PATCH /api/orders/progress**

Update order status and track progress automatically.

**Request:**
```json
{
  "orderId": "ORD-20261005-ABC123",
  "status": "shipped",
  "notes": "Order shipped via FedEx",
  "trackingNumber": "ABC123456",
  "carrier": "FedEx",
  "estimatedDelivery": "2026-10-10T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "order": {...},
  "message": "Order status updated to shipped"
}
```

---

### Admin: Get All Orders

**GET /api/admin/orders**

```javascript
// Query Parameters
?status=paid                   // Filter by status
?paymentStatus=completed       // Filter by payment status
?sort=-createdAt               // Sort
?limit=50                       // Items per page
?skip=0                         // Pagination offset
```

**Response:**
```json
{
  "success": true,
  "orders": [...],
  "stats": {
    "totalOrders": 1250,
    "pendingOrders": 45,
    "paidOrders": 1100,
    "shippedOrders": 850,
    "deliveredOrders": 800,
    "cancelledOrders": 15,
    "totalRevenue": [{total: 5625000}]
  },
  "pagination": {...}
}
```

---

### Admin: Update Order

**PATCH /api/admin/orders**

Admin can update any order details and notes.

**Request:**
```json
{
  "orderId": "ORD-20261005-ABC123",
  "updates": {
    "status": "shipped",
    "notes": "Order shipped",
    "shipping": {
      "trackingNumber": "ABC123456",
      "carrier": "FedEx"
    }
  }
}
```

---

## Order Status Flow

```
┌─────────────┐
│   pending   │  Order received, awaiting payment
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    paid     │  Payment received, order processing
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  processing     │  Being prepared for shipment
└────────┬────────┘
         │
         ▼
┌─────────────┐
│   shipped   │  In transit to customer
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   delivered     │  Successfully delivered
└─────────────────┘
```

Alternative paths:
- `pending` → `failed` (Payment failed)
- `pending` → `cancelled` (User cancelled)
- Any → `cancelled` (Admin cancelled)

---

## Progress Timeline

Each order tracks a timeline of all status changes:

```javascript
progressTimeline: [
  {
    status: 'pending',
    description: 'Order received and awaiting payment',
    timestamp: '2026-10-05T15:30:00Z',
    notes: 'Order created'
  },
  {
    status: 'paid',
    description: 'Payment received, order processing',
    timestamp: '2026-10-05T15:35:00Z',
    notes: 'PayHere payment notification received'
  },
  {
    status: 'processing',
    description: 'Order being prepared for shipment',
    timestamp: '2026-10-05T16:00:00Z',
    notes: 'Items picked and packed'
  },
  {
    status: 'shipped',
    description: 'Order has been shipped',
    timestamp: '2026-10-05T17:30:00Z',
    notes: 'Tracking: ABC123456'
  }
]
```

---

## Shipping Information

Track shipment details:

```javascript
shipping: {
  trackingNumber: 'ABC123456',
  carrier: 'FedEx',              // FedEx, DHL, Local Courier, etc.
  estimatedDelivery: Date,
  actualDelivery: Date
}
```

---

## Return & Refund Management

```javascript
// Return Request
returnStatus: 'requested',      // none, requested, approved, completed, rejected
returnReason: 'Damaged product',
refundAmount: 5350,
refundStatus: 'pending'         // none, pending, completed, failed
```

---

## Usage Examples

### JavaScript Example: Get User's Orders

```javascript
const userId = '507f1f77bcf86cd799439011';

const response = await fetch('/api/orders/user?status=shipped&sort=-createdAt', {
  headers: {
    'x-user-id': userId
  }
});

const data = await response.json();
data.orders.forEach(order => {
  console.log(`${order.orderId}: ${order.status} - ${order.progressPercentage}%`);
});
```

### JavaScript Example: Track Order

```javascript
const orderId = 'ORD-20261005-ABC123';

const response = await fetch(`/api/orders/${orderId}`);
const data = await response.json();

console.log('Order Status:', data.order.status);
console.log('Progress:', data.progressPercentage + '%');

// Show timeline
data.order.progressTimeline.forEach(entry => {
  console.log(`${entry.timestamp}: ${entry.description}`);
});
```

### JavaScript Example: Update Order (Admin)

```javascript
const response = await fetch('/api/orders/progress', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: 'ORD-20261005-ABC123',
    status: 'shipped',
    notes: 'Shipped via FedEx',
    trackingNumber: 'ABC123456',
    carrier: 'FedEx'
  })
});

const data = await response.json();
console.log(data.message);
```

---

## Database Queries

### Get all orders for a user

```javascript
db.orders.find({ userId: ObjectId('507f1f77bcf86cd799439011') })
```

### Get pending orders

```javascript
db.orders.find({ status: 'pending' })
```

### Get shipped orders

```javascript
db.orders.find({ status: 'shipped' })
```

### Get delivered orders

```javascript
db.orders.find({ status: 'delivered' })
```

### Get total revenue

```javascript
db.orders.aggregate([
  { $match: { status: 'paid' } },
  { $group: { _id: null, total: { $sum: '$total' } } }
])
```

### Find order by tracking number

```javascript
db.orders.findOne({ 'shipping.trackingNumber': 'ABC123456' })
```

---

## Progress Percentage Calculation

```
Status Progression: pending → paid → processing → shipped → delivered

pending:    0%
paid:      25%
processing: 50%
shipped:   75%
delivered: 100%
failed:    0% (special case)
```

---

## Admin Features

### Order Statistics

```javascript
GET /api/admin/orders

Returns:
- Total orders
- Pending orders
- Paid orders
- Shipped orders
- Delivered orders
- Cancelled orders
- Total revenue
```

### Filter Orders

```javascript
// By status
GET /api/admin/orders?status=shipped

// By payment status
GET /api/admin/orders?paymentStatus=completed

// Sorted by date (newest first)
GET /api/admin/orders?sort=-createdAt
```

### Update Orders

```javascript
// Update order details
PATCH /api/admin/orders
{
  "orderId": "ORD-20261005-ABC123",
  "updates": {
    "status": "shipped",
    "notes": "Order shipped"
  }
}
```

---

## Integration with Payment System

When PayHere webhook is received:

1. Order `paymentStatus` updated
2. `progressTimeline` entry added
3. `paidAt` timestamp recorded
4. Order status changed to `paid`
5. Automatic transition to `processing`

---

## What's Tracked

✅ Order items and quantities
✅ Customer information
✅ Payment details
✅ Order timeline
✅ Status changes
✅ Timestamps for each status
✅ Shipping information
✅ Tracking numbers
✅ Return requests
✅ Refund status
✅ Admin notes
✅ User reference
✅ Order progress percentage

---

## Storage Benefits

✅ **Permanent** - All order data saved to MongoDB
✅ **Trackable** - Complete timeline of order progress
✅ **Searchable** - Admin can find any order
✅ **Queryable** - Generate reports and analytics
✅ **Historical** - Complete order history
✅ **Auditable** - All changes timestamped
✅ **Scalable** - Supports unlimited orders

---

## Next Steps

1. Display orders in customer dashboard
2. Add order tracking page
3. Send email notifications on status change
4. Add return/refund management UI
5. Create admin order management panel
6. Generate invoice PDFs
7. Export order data

---

**Last Updated:** October 5, 2026  
**Status:** Complete & Ready for Use
