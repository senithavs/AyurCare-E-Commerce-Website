# PayHere Payment Gateway Integration Guide

Complete documentation for the PayHere payment integration in the AyurCare e-commerce platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Security](#security)
4. [Setup & Configuration](#setup--configuration)
5. [Payment Flow](#payment-flow)
6. [API Endpoints](#api-endpoints)
7. [Testing](#testing)
8. [Localhost Development](#localhost-development)
9. [Moving to Production](#moving-to-production)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This integration provides a complete PayHere payment gateway solution for the AyurCare e-commerce platform. It handles:

- ✅ Secure checkout with customer information collection
- ✅ Server-side payment initialization with hash generation
- ✅ Sandbox/test mode support for development
- ✅ Payment status pages (success, cancel, failed)
- ✅ Server-to-server webhook notifications from PayHere
- ✅ Order status tracking (temporary/mock storage)

### Key Features

- **Security First**: Merchant Secret never exposed to client
- **Clean Architecture**: Separation of concerns (frontend, API, utilities)
- **Sandbox Ready**: Configured for PayHere sandbox testing
- **Extensible**: Easy to add database persistence later
- **Error Handling**: Comprehensive error messages and logging

---

## Architecture

### Payment Flow Diagram

```
Customer
    ↓
Shop (Browse Products)
    ↓
Cart (Add/Manage Items)
    ↓
Checkout (Customer Information)
    ↓
Pay with PayHere Button
    ↓
/api/payment/payhere (Server-side)
    ├─ Validate checkout data
    ├─ Verify product prices (prevent manipulation)
    ├─ Calculate order total
    ├─ Generate order ID (ORD-YYYYMMDD-RANDOM)
    ├─ Generate PayHere hash (MD5)
    ├─ Store temporary order
    └─ Return payment parameters
    ↓
PayHere Sandbox Gateway
    ↓
Customer Enters Payment Details
    ↓
Payment Processing
    ├─ Success → Redirect to /payment/success
    ├─ Cancel → Redirect to /payment/cancel
    └─ Failed → Redirect to /payment/failed
    ↓
Simultaneously:
/api/payment/payhere/notify (Server-to-Server Webhook)
    ├─ Receive PayHere notification
    ├─ Validate hash (prevent forgery)
    ├─ Update order status
    └─ Return 200 OK to PayHere
    ↓
Status Pages Display Order Information
```

### File Structure

```
src/
├── app/
│   ├── checkout/
│   │   └── page.js                    # Checkout form with customer info
│   ├── payment/
│   │   ├── success/
│   │   │   └── page.js                # Payment success page
│   │   ├── cancel/
│   │   │   └── page.js                # Payment cancel page
│   │   └── failed/
│   │       └── page.js                # Payment failed page
│   └── api/
│       └── payment/
│           └── payhere/
│               ├── route.js            # Payment initialization
│               └── notify/
│                   └── route.js        # Payment webhook endpoint
├── components/
│   └── payment/
│       └── PayHereButton.js            # Payment submission component
└── lib/
    └── payment/
        └── payhere.js                  # Utility functions

.env.local                              # Environment variables (local)
.env.example                            # Environment template
```

---

## Security

### Merchant Secret Protection

The `PAYHERE_MERCHANT_SECRET` is **NEVER**:
- Exposed to the client/browser
- Hardcoded in source code
- Committed to Git
- Logged in client-side code
- Sent to the frontend

### Hash Verification

All payment hashes are calculated server-side using MD5:

**Payment Request Hash:**
```
md5(merchant_id + order_id + total_amount + merchant_secret)
```

**Notification Validation Hash:**
```
md5(merchant_id + order_id + total_amount + payment_id + merchant_secret)
```

### Server-Side Validation

The server:
- Recalculates order totals (never trusts client price)
- Verifies product prices from the database
- Validates checkout data (email, phone, address format)
- Prevents quantity manipulation

---

## Setup & Configuration

### Step 1: Get PayHere Credentials

1. Visit [PayHere Sandbox](https://sandbox.payhere.lk/)
2. Create a merchant account
3. Go to Settings → Integrations
4. Note your:
   - **Merchant ID** (e.g., `1234567`)
   - **Merchant Secret** (e.g., `your_secret_key`)

### Step 2: Configure Environment Variables

Edit `.env.local`:

```bash
MONGODB_URI=mongodb+srv://...

# PayHere Integration
PAYHERE_MERCHANT_ID=1234567
PAYHERE_MERCHANT_SECRET=your_secret_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **IMPORTANT**:
- Never commit `.env.local` to Git
- `.env.local` is in `.gitignore`
- Only `.env.example` should be committed (without real values)

### Step 3: Verify Configuration

Start the Next.js development server:

```bash
npm run dev
```

The server will:
- Load environment variables from `.env.local`
- Initialize the payment API routes
- Make webhook endpoint available

Visit `http://localhost:3000/checkout` to verify the checkout page loads.

---

## Payment Flow

### 1. Add Products to Cart

- Browse `/shop`
- Click "Add to Cart" on products
- Cart updates in real-time
- Items persist in `localStorage`

### 2. Go to Checkout

- Click "Proceed to Checkout" from `/cart`
- Fill in customer information:
  - First Name, Last Name
  - Email Address
  - Phone Number
  - Street Address
  - City
  - Country (currently Sri Lanka only)
- Review order summary

### 3. Initiate Payment

Click "Pay with PayHere" button:

1. **Client-side validation**: Check all fields are filled
2. **API call**: POST to `/api/payment/payhere`
   ```javascript
   {
     checkoutData: { firstName, lastName, email, phone, address, city, country },
     cartItems: [...],
     orderTotal: 5350
   }
   ```
3. **Server processes**:
   - Validates checkout data
   - Recalculates order total
   - Verifies product prices
   - Generates order ID
   - Calculates PayHere hash
   - Stores temporary order
4. **Response**: Returns payment parameters
5. **Form submission**: Hidden form posts to PayHere gateway

### 4. Complete Payment on PayHere

User is redirected to `https://sandbox.payhere.lk/pay/checkout`

- Enter test card details
- Complete payment
- PayHere redirects to success/cancel/failed page

### 5. Webhook Notification

Simultaneously (server-to-server):
- PayHere sends POST to `/api/payment/payhere/notify`
- Endpoint validates hash and updates order status
- Returns 200 OK to PayHere

### 6. Display Status

Status page shows:
- Order confirmation details
- Payment status
- Items ordered
- Delivery address
- Next steps

---

## API Endpoints

### POST /api/payment/payhere

**Payment Initialization**

Receives checkout data and initializes PayHere payment.

**Request:**
```javascript
POST /api/payment/payhere
Content-Type: application/json

{
  "checkoutData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+94 70 123 4567",
    "address": "123 Main Street",
    "city": "Colombo",
    "country": "Sri Lanka"
  },
  "cartItems": [
    {
      "id": "ayu-001",
      "name": "Ashwagandha",
      "quantity": 2,
      "price": 1500
    }
  ],
  "orderTotal": 5350
}
```

**Response (200 OK):**
```javascript
{
  "success": true,
  "paymentData": {
    "merchant_id": "1234567",
    "order_id": "ORD-20261005-ABC123",
    "items": "Ashwagandha x2",
    "currency": "LKR",
    "amount": 5350,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+94 70 123 4567",
    "address": "123 Main Street",
    "city": "Colombo",
    "country": "Sri Lanka",
    "hash": "a1b2c3d4e5f6g7h8i9j0",
    "return_url": "http://localhost:3000/payment/success?order_id=...",
    "cancel_url": "http://localhost:3000/payment/cancel?order_id=...",
    "notify_url": "http://localhost:3000/api/payment/payhere/notify"
  }
}
```

**Error Response (400 Bad Request):**
```javascript
{
  "error": "Invalid checkout data",
  "details": {
    "email": "Invalid email address",
    "phone": "Phone number is required"
  }
}
```

---

### POST /api/payment/payhere/notify

**Payment Notification Webhook**

Receives payment status from PayHere (server-to-server).

**Request (from PayHere):**
```javascript
POST /api/payment/payhere/notify
Content-Type: application/x-www-form-urlencoded

merchant_id=1234567&
order_id=ORD-20261005-ABC123&
payhere_amount=5350&
payhere_currency=LKR&
status_code=2&
payment_id=987654321&
md5sig=a1b2c3d4e5f6g7h8i9j0
```

**PayHere Status Codes:**
- `2`: Payment successful (completed)
- `1`: Payment pending
- `0`: Payment failed
- `-1`: Payment cancelled by user

**Response (200 OK):**
```javascript
{
  "status": "ok",
  "order_id": "ORD-20261005-ABC123",
  "payment_id": "987654321",
  "message": "Notification received and processed"
}
```

---

## Testing

### Test Card Details (PayHere Sandbox)

Use these test cards in the PayHere sandbox:

**Successful Payment:**
- Card Number: `4111111111111111`
- Expiry: `12/25`
- CVV: `123`

**Failed Payment:**
- Card Number: `5105105105105100`
- Expiry: `12/25`
- CVV: `123`

### Test Procedure

#### Test 1: Complete Checkout Flow

1. Navigate to `http://localhost:3000/shop`
2. Add 2-3 products to cart
3. Click "View Cart" or navigate to `/cart`
4. Click "Proceed to Checkout"
5. Fill in customer information:
   ```
   First Name: Test
   Last Name: User
   Email: test@example.com
   Phone: +94 70 123 4567
   Address: 123 Test Street
   City: Colombo
   Country: Sri Lanka
   ```
6. Click "Pay with PayHere"
7. You should be redirected to PayHere sandbox

**Expected Result:** PayHere payment page loads with correct order details

---

#### Test 2: Successful Payment

1. Complete Test 1 (reach PayHere payment page)
2. Enter test card details (successful):
   - Card: `4111111111111111`
   - Expiry: `12/25`
   - CVV: `123`
3. Click "Pay Now"
4. You should be redirected to `/payment/success?order_id=ORD-...`

**Expected Result:**
- ✅ Order confirmation page displays
- ✅ Order ID shows (e.g., `ORD-20261005-ABC123`)
- ✅ Order total shows correctly
- ✅ Items listed with quantities
- ✅ Customer email shows
- ✅ "Continue Shopping" button works
- ✅ Cart is cleared

**Check Webhook:**
```bash
# In server logs, you should see:
# Payment initialized: order_id, amount, etc.
# PayHere notification received: order_id, status_code=2
# Order status updated: status=completed
```

---

#### Test 3: Cancelled Payment

1. Complete Test 1 (reach PayHere payment page)
2. Click "Cancel" button on PayHere page
3. You should be redirected to `/payment/cancel?order_id=ORD-...`

**Expected Result:**
- ✅ Cancellation page displays
- ✅ Message says "Payment Cancelled"
- ✅ Order amount is shown as "Not Charged"
- ✅ "Back to Cart" button shows cart items
- ✅ Cart items are NOT cleared

---

#### Test 4: Failed Payment

1. Complete Test 1 (reach PayHere payment page)
2. Enter test card details (failed):
   - Card: `5105105105105100`
   - Expiry: `12/25`
   - CVV: `123`
3. Click "Pay Now"
4. You should be redirected to `/payment/failed?order_id=ORD-...`

**Expected Result:**
- ✅ Failure page displays
- ✅ Message says "Payment Failed"
- ✅ Troubleshooting steps shown
- ✅ "Try Payment Again" button works
- ✅ "Contact Support" button links to `/contact`

---

#### Test 5: Form Validation

1. Navigate to `/checkout`
2. Leave all fields empty
3. Click "Pay with PayHere"

**Expected Result:**
- ✅ Error message displays
- ✅ Form prevents submission
- ✅ All fields are highlighted as required

---

#### Test 6: Security Verification

1. Open DevTools (F12)
2. Go to Network tab
3. Complete a payment to the success page
4. Check all API calls

**Expected Result:**
- ✅ `PAYHERE_MERCHANT_SECRET` does NOT appear in browser
- ✅ `PAYHERE_MERCHANT_SECRET` does NOT appear in Network requests
- ✅ Order total is recalculated on server
- ✅ Hash appears only in server response, not client-side code

---

### Debugging

#### Enable Detailed Logging

Edit `src/app/api/payment/payhere/route.js` and `src/app/api/payment/payhere/notify/route.js`:

```javascript
// Add detailed logging for debugging
console.log('Full request data:', data);
console.log('Calculated hash:', calculatedHash);
console.log('Provided hash:', providedHash);
```

Then check server logs:
```bash
npm run dev
# Logs will appear in the terminal
```

#### Check Order Storage

Add a temporary endpoint to inspect stored orders:

```javascript
// In a debug route (don't use in production)
import { getAllTemporaryOrders } from '@/lib/payment/payhere';

export function GET() {
  const orders = getAllTemporaryOrders();
  return new Response(JSON.stringify(orders), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

Then visit `http://localhost:3000/api/debug/orders` (implement debug route as needed).

---

## Localhost Development

### Direct Localhost Testing

**What works:**
- ✅ Full checkout flow (except webhook notification)
- ✅ PayHere sandbox payment page
- ✅ Browser redirects (return_url, cancel_url)
- ✅ Form submission

**What doesn't work:**
- ❌ PayHere webhook notifications (notify_url)
  - Reason: PayHere's servers cannot reach `http://localhost:3000`
  - Solution: Use ngrok tunnel (see below)

### Using ngrok for Webhook Testing

PayHere needs a public HTTPS URL to send webhook notifications.

#### Step 1: Install ngrok

Option A - Using Homebrew (macOS):
```bash
brew install ngrok
```

Option B - Using npm:
```bash
npm install -g ngrok
```

Option C - Manual installation:
Visit https://ngrok.com/download

#### Step 2: Start ngrok Tunnel

In a separate terminal:

```bash
ngrok http 3000
```

Output:
```
ngrok                                       (Ctrl+C to quit)

Session Status: online
Account: your-email@example.com (Plan: Free)

Version: 3.3.0
Region: us (United States)
Latency: 45ms
Web Interface: http://127.0.0.1:4040

Forwarding: https://abc123def456.ngrok.io -> http://localhost:3000
```

#### Step 3: Update Environment Variables

Edit `.env.local`:

```bash
PAYHERE_MERCHANT_ID=1234567
PAYHERE_MERCHANT_SECRET=your_secret_key

# Use ngrok URL instead of localhost
NEXT_PUBLIC_APP_URL=https://abc123def456.ngrok.io
```

#### Step 4: Restart Next.js Server

```bash
npm run dev
```

#### Step 5: Test Webhook

Now PayHere can send notifications to:
```
https://abc123def456.ngrok.io/api/payment/payhere/notify
```

Complete a payment and check:
1. Browser redirects work
2. Server logs show webhook notification received
3. Order status updates to "completed"

#### Important Notes

⚠️ ngrok URL changes each time you restart
- Update `.env.local` with new URL
- Restart Next.js server

✅ Free ngrok plan works fine for development
- Comes with bandwidth limits
- Perfect for testing

---

## Moving to Production

### Step 1: Replace Temporary Order Storage

Current implementation uses in-memory storage. Replace with database:

```javascript
// OLD (src/lib/payment/payhere.js)
const tempOrders = new Map();

export function storeTemporaryOrder(orderId, orderData) {
  tempOrders.set(orderId, { ...orderData, createdAt: new Date().toISOString() });
}

// NEW (with MongoDB/PostgreSQL)
import Order from '@/models/Order';

export async function storeTemporaryOrder(orderId, orderData) {
  return await Order.create({
    orderId,
    items: orderData.items,
    total: orderData.total,
    customer: orderData.customer,
    status: 'pending',
    createdAt: new Date(),
  });
}
```

### Step 2: Update Webhook Notification Handler

Instead of temporary storage, update the database:

```javascript
// In src/app/api/payment/payhere/notify/route.js
import Order from '@/models/Order';

if (paymentStatus === 'completed') {
  await Order.findOneAndUpdate(
    { orderId: order_id },
    { 
      status: 'paid',
      paymentId: payment_id,
      paymentAmount: payhere_amount,
      paidAt: new Date(),
    }
  );
}
```

### Step 3: Add Email Notifications

Send confirmation emails to customers:

```javascript
import { sendOrderConfirmationEmail } from '@/lib/email';

if (paymentStatus === 'completed') {
  await sendOrderConfirmationEmail(order.customer.email, order);
}
```

### Step 4: Inventory Management

Decrement inventory when payment succeeds:

```javascript
if (paymentStatus === 'completed') {
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.id, {
      $inc: { stockCount: -item.quantity }
    });
  }
}
```

### Step 5: Switch to Production PayHere

When ready for production:

1. Create production merchant account on PayHere
2. Get production credentials
3. Update environment variables:

```bash
# .env.production.local (production environment)
PAYHERE_MERCHANT_ID=production_merchant_id
PAYHERE_MERCHANT_SECRET=production_merchant_secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

4. Update PayHere gateway URL in `src/components/payment/PayHereButton.js`:

```javascript
// Change from sandbox
form.action = 'https://www.payhere.lk/pay/checkout'; // Production
// Instead of
form.action = 'https://sandbox.payhere.lk/pay/checkout'; // Sandbox
```

### Step 6: Configure Production Webhooks

In PayHere dashboard:
1. Go to Settings → Integrations
2. Set Webhook URL to: `https://yourdomain.com/api/payment/payhere/notify`
3. Enable all notification events

### Step 7: SSL/HTTPS

Ensure your production domain has:
- ✅ Valid SSL certificate
- ✅ HTTPS enabled
- ✅ Security headers configured

---

## Troubleshooting

### Common Issues

#### "PayHere credentials not configured"

**Problem:** Error when trying to checkout

**Solution:**
1. Check `.env.local` file exists
2. Verify `PAYHERE_MERCHANT_ID` and `PAYHERE_MERCHANT_SECRET` are set
3. Restart Next.js server: `npm run dev`
4. Clear browser cache (Ctrl+Shift+Delete)

---

#### "Invalid checkout data" error

**Problem:** Checkout form won't submit

**Solution:**
1. Check all fields are filled (not empty)
2. Verify email format (must contain @)
3. Check phone number is not empty
4. Check address and city are filled

---

#### "Payment hash validation failed"

**Problem:** Webhook notification rejected

**Possible Causes:**
1. Merchant Secret is incorrect
2. Merchant ID in notification doesn't match configuration
3. Amount format is wrong (should be integer, no decimals)
4. Hash calculation is wrong

**Solution:**
1. Verify `PAYHERE_MERCHANT_SECRET` in `.env.local`
2. Check PayHere merchant ID matches
3. Add logging to see hash values:
   ```javascript
   console.log('Expected hash:', calculatedHash);
   console.log('Provided hash:', md5sig);
   ```

---

#### Webhook notification never received

**Problem:** Order status never updates to "completed"

**Possible Causes:**
1. Localhost cannot be reached by PayHere servers
2. Firewall blocking incoming connections
3. notify_url is incorrect

**Solution:**
1. Use ngrok tunnel (see "Using ngrok for Webhook Testing")
2. Check `.env.local` has correct `NEXT_PUBLIC_APP_URL`
3. Verify `notify_url` in PayHere dashboard

---

#### PayHere payment page doesn't load

**Problem:** Blank page after clicking "Pay with PayHere"

**Solution:**
1. Check browser console for errors (F12)
2. Verify API response in Network tab
3. Ensure Merchant ID is correct
4. Check browser allows form submission

---

#### Cart not clearing after payment

**Problem:** Items remain in cart after successful payment

**Solution:**
1. Success page should call `clearCart()` from CartContext
2. Check `src/app/payment/success/page.js` has:
   ```javascript
   const { clearCart } = useCart();
   useEffect(() => {
     clearCart();
   }, []);
   ```

---

## Support

For PayHere-specific questions:
- 📖 [PayHere Documentation](https://developers.payhere.lk/)
- 💬 [PayHere Support](https://payhere.lk/contact-us)
- 🔗 [PayHere Merchant Dashboard](https://www.payhere.lk/)

For AyurCare integration questions:
- Check this guide's troubleshooting section
- Review server logs for detailed error messages
- Inspect network requests in browser DevTools

---

## Next Steps

### When You Have a Database

1. Replace `src/lib/payment/payhere.js` temporary storage with database queries
2. Update `src/app/api/payment/payhere/notify/route.js` to save to database
3. Implement order history in customer dashboard
4. Add email notifications

### When You Have User Authentication

1. Associate orders with user accounts
2. Show order history in customer profile
3. Add "My Orders" page
4. Implement order tracking

### Advanced Features

1. Support multiple currencies
2. Add subscription/recurring payments
3. Implement refunds
4. Add invoice generation
5. Create admin dashboard for payment management

---

## Version History

- **v1.0** (2026-10-05): Initial PayHere integration
  - Sandbox testing
  - Checkout flow
  - Payment status pages
  - Webhook notification handling
  - Temporary order storage

---

**Last Updated:** September 29, 2026
**Maintained by:** AyurCare Development Team
