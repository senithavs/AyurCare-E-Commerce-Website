/**
 * PayHere Payment Initialization API Route
 * 
 * Endpoint: POST /api/payment/payhere
 * 
 * This is a server-side only route that:
 * 1. Receives checkout data from the client
 * 2. Validates all required information
 * 3. Recalculates the order total (NEVER trusts client price)
 * 4. Generates a unique order ID
 * 5. Calculates the PayHere payment hash using the Merchant Secret
 * 6. Returns payment parameters (without exposing Merchant Secret)
 * 
 * Security:
 * - Merchant Secret is NEVER sent to client
 * - Order total is recalculated server-side
 * - Input validation prevents injection attacks
 * - Sensitive data is logged safely
 * 
 * The Merchant Secret remains server-side only.
 */

import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import {
  generatePaymentHash,
  generateOrderId,
  validateCheckoutData,
  calculateOrderTotal,
} from '@/lib/payment/payhere';
import { getAllProducts } from '@/lib/productsData';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const { checkoutData, cartItems } = await request.json();

    // ========================================
    // 1. VALIDATION
    // ========================================

    // Validate checkout data
    const { valid, errors } = validateCheckoutData(checkoutData);
    if (!valid) {
      return new Response(
        JSON.stringify({
          error: 'Invalid checkout data',
          details: errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate cart items
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Cart is empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // 2. VERIFY PRODUCT PRICES (Server-side)
    // ========================================

    // Get all products to verify prices
    // This prevents client-side price manipulation
    const allProducts = getAllProducts();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    // Verify each cart item and recalculate prices
    const verifiedCartItems = cartItems.map((item) => {
      const product = productMap.get(item.id);

      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }

      // Use server-verified price, not client-sent price
      return {
        id: item.id,
        name: item.name,
        quantity: Math.max(1, parseInt(item.quantity) || 1), // Ensure valid quantity
        price: product.price, // Use product's actual price from server
      };
    });

    // ========================================
    // 3. CALCULATE ORDER TOTAL (Server-side)
    // ========================================

    let orderCalculation;
    try {
      orderCalculation = calculateOrderTotal(verifiedCartItems, 350, 0.1);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Failed to calculate order total' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { subtotal, tax, deliveryFee, total, currency } = orderCalculation;

    // ========================================
    // 4. ENVIRONMENT VARIABLES CHECK
    // ========================================

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!merchantId || !merchantSecret) {
      console.error('PayHere credentials not configured');
      return new Response(
        JSON.stringify({
          error: 'Payment gateway not configured',
          message: 'Please contact support',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!appUrl) {
      console.error('NEXT_PUBLIC_APP_URL not configured');
      return new Response(
        JSON.stringify({
          error: 'Application configuration error',
          message: 'Please contact support',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // 5. GENERATE ORDER ID
    // ========================================

    const orderId = generateOrderId();

    // ========================================
    // 6. GENERATE PAYHERE HASH
    // ========================================

    let paymentHash;
    try {
      paymentHash = generatePaymentHash(
        merchantId,
        orderId,
        total,
        merchantSecret
      );
    } catch (err) {
      console.error('Hash generation error:', err);
      return new Response(
        JSON.stringify({ error: 'Payment initialization failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // 7. CONSTRUCT RETURN/CALLBACK URLS
    // ========================================

    const returnUrl = `${appUrl}/payment/success?order_id=${orderId}`;
    const cancelUrl = `${appUrl}/payment/cancel?order_id=${orderId}`;
    const notifyUrl = `${appUrl}/api/payment/payhere/notify`;

    // ========================================
    // 8. FORMAT ITEMS FOR PAYHERE
    // ========================================

    // PayHere expects items as a single string (e.g., "Product1 x1, Product2 x2")
    const itemsDescription = verifiedCartItems
      .map((item) => `${item.name} x${item.quantity}`)
      .join(', ');

    // ========================================
    // 9. STORE ORDER IN DATABASE
    // ========================================

    try {
      const newOrder = new Order({
        orderId,
        userId: checkoutData.userId, // Store user ID if provided
        items: verifiedCartItems,
        subtotal,
        tax,
        deliveryFee,
        total,
        currency,
        customer: {
          firstName: checkoutData.firstName,
          lastName: checkoutData.lastName,
          email: checkoutData.email,
          phone: checkoutData.phone,
          address: checkoutData.address,
          country: 'Sri Lanka',
        },
        status: 'pending',
        paymentStatus: 'pending',
        // Add initial progress timeline entry
        progressTimeline: [
          {
            status: 'pending',
            description: 'Order received and awaiting payment',
            timestamp: new Date(),
            notes: 'Order created',
          },
        ],
      });

      const savedOrder = await newOrder.save();
      console.log('Order saved to database:', {
        orderId: savedOrder.orderId,
        userId: savedOrder.userId,
      });
    } catch (err) {
      console.error('Failed to store order in database:', err);
      // Continue anyway - payment can still be processed
    }

    // ========================================
    // 10. LOG PAYMENT INITIALIZATION (Safe Logging)
    // ========================================

    console.log('Payment initialized:', {
      orderId,
      amount: total,
      currency,
      customerEmail: checkoutData.email,
      timestamp: new Date().toISOString(),
    });

    // ========================================
    // 11. RETURN PAYMENT DATA
    // ========================================

    // Return all parameters needed by PayHereButton component
    // Merchant Secret is NEVER included
    return new Response(
      JSON.stringify({
        success: true,
        paymentData: {
          merchant_id: merchantId,
          order_id: orderId,
          items: itemsDescription,
          currency,
          amount: total,
          first_name: checkoutData.firstName,
          last_name: checkoutData.lastName,
          email: checkoutData.email,
          phone: checkoutData.phone,
          address: checkoutData.address,
          city: 'Colombo',
          country: 'Sri Lanka',
          hash: paymentHash,
          return_url: returnUrl,
          cancel_url: cancelUrl,
          notify_url: notifyUrl,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Payment API error:', err);

    // Return generic error to prevent information leakage
    return new Response(
      JSON.stringify({
        error: 'Payment initialization failed',
        message: 'An unexpected error occurred. Please try again.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
