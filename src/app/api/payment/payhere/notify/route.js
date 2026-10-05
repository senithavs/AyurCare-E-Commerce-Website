/**
 * PayHere Payment Notification Endpoint
 * 
 * Endpoint: POST /api/payment/payhere/notify
 * 
 * This is a server-to-server webhook endpoint that receives payment notifications from PayHere.
 * 
 * IMPORTANT SECURITY NOTES:
 * ========================
 * 1. This endpoint is called DIRECTLY by PayHere's servers (not the browser)
 * 2. NEVER trust the browser's return_url redirect - always validate via this notify endpoint
 * 3. PayHere may retry this endpoint multiple times
 * 4. Must validate the payment hash to ensure notification authenticity
 * 5. Must return 200 OK for PayHere to consider notification delivered
 * 6. For production: Implement idempotency to handle duplicate notifications
 * 
 * PayHere Status Codes:
 * - 2: Payment successful (completed)
 * - 1: Payment pending
 * - 0: Payment failed
 * - -1: Payment cancelled by user
 * 
 * Response Codes:
 * - 200: Notification received and processed
 * - 400: Invalid notification (will trigger retry)
 * - 500: Server error (will trigger retry)
 * 
 * @see https://developers.payhere.lk/docs/payment-notification
 */

import { validateNotificationHash, updateTemporaryOrderStatus } from '@/lib/payment/payhere';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // ========================================
    // 1. PARSE NOTIFICATION DATA
    // ========================================

    const data = await request.json();

    // PayHere sends the following parameters:
    // - merchant_id: Your merchant ID
    // - order_id: Order ID from payment request
    // - payhere_amount: Amount paid
    // - payhere_currency: Currency (LKR)
    // - status_code: Payment status (2=success, 0=failed, 1=pending, -1=cancelled)
    // - payment_id: PayHere's transaction ID
    // - md5sig: HMAC signature for verification
    // - custom_1, custom_2, custom_3: Custom parameters (if sent in request)

    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      payment_id,
      md5sig,
    } = data;

    console.log('PayHere notification received:', {
      order_id,
      status_code,
      payment_id,
      amount: payhere_amount,
      timestamp: new Date().toISOString(),
    });

    // ========================================
    // 2. VALIDATE NOTIFICATION PARAMETERS
    // ========================================

    if (!merchant_id || !order_id || !payhere_amount || !status_code || !payment_id || !md5sig) {
      console.error('Invalid PayHere notification: Missing required parameters', {
        merchant_id,
        order_id,
        payhere_amount,
        status_code,
        payment_id,
        md5sig: md5sig ? 'present' : 'missing',
      });

      return new Response(
        JSON.stringify({ error: 'Invalid notification parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // 3. VALIDATE MERCHANT ID
    // ========================================

    const expectedMerchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!expectedMerchantId || !merchantSecret) {
      console.error('PayHere credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (merchant_id !== expectedMerchantId) {
      console.error('Invalid merchant ID in notification:', merchant_id);
      return new Response(
        JSON.stringify({ error: 'Invalid merchant' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // 4. VALIDATE NOTIFICATION HASH
    // ========================================

    // The hash is calculated as:
    // md5(merchant_id + order_id + payhere_amount + payment_id + merchant_secret)
    //
    // This prevents man-in-the-middle attacks and ensures the notification
    // genuinely came from PayHere

    let isHashValid = false;
    try {
      isHashValid = validateNotificationHash(
        merchant_id,
        order_id,
        payhere_amount,
        payment_id,
        merchantSecret,
        md5sig
      );
    } catch (err) {
      console.error('Hash validation error:', err);
      return new Response(
        JSON.stringify({ error: 'Hash validation failed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isHashValid) {
      console.error('Invalid payment notification hash', {
        order_id,
        payment_id,
        providedHash: md5sig,
      });

      // CRITICAL: Invalid hash means the notification may be forged
      // Return 400 to tell PayHere this notification failed
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // 5. VALIDATE CURRENCY
    // ========================================

    if (payhere_currency !== 'LKR') {
      console.warn('Unexpected currency in notification:', payhere_currency);
      // Still process, but log the warning
    }

    // ========================================
    // 6. MAP STATUS CODE TO STATUS STRING
    // ========================================

    let paymentStatus;
    switch (parseInt(status_code)) {
      case 2:
        paymentStatus = 'completed';
        break;
      case 1:
        paymentStatus = 'pending';
        break;
      case 0:
        paymentStatus = 'failed';
        break;
      case -1:
        paymentStatus = 'cancelled';
        break;
      default:
        paymentStatus = 'unknown';
        console.warn('Unknown status code:', status_code);
    }

    // ========================================
    // 7. UPDATE ORDER STATUS IN DATABASE
    // ========================================

    try {
      await Order.findOneAndUpdate(
        { orderId: order_id },
        {
          paymentStatus,
          status: paymentStatus === 'completed' ? 'paid' : 'pending',
          paymentId: payment_id,
          paymentAmount: payhere_amount,
          paymentCurrency: payhere_currency,
          notificationReceivedAt: new Date(),
          ...(paymentStatus === 'failed' && { failedAt: new Date() }),
          ...(paymentStatus === 'cancelled' && { cancelledAt: new Date() }),
          ...(paymentStatus === 'completed' && { paidAt: new Date() }),
        },
        { new: true }
      );

      console.log('Order status updated in database:', {
        order_id,
        status: paymentStatus,
        payment_id,
      });
    } catch (err) {
      console.error('Failed to update order in database:', err);
      // Still return 200 to acknowledge receipt
    }

    // ========================================
    // 8. HANDLE PAYMENT STATUS
    // ========================================

    if (paymentStatus === 'completed') {
      console.log('✓ Payment successful:', {
        order_id,
        payment_id,
        amount: payhere_amount,
      });

      // In production, you would:
      // - Update database order status to 'paid'
      // - Decrement inventory
      // - Send confirmation email
      // - Trigger fulfillment process
    } else if (paymentStatus === 'failed') {
      console.log('✗ Payment failed:', {
        order_id,
        payment_id,
      });

      // In production, you would:
      // - Update order status to 'failed'
      // - Send failure notification to customer
    } else if (paymentStatus === 'cancelled') {
      console.log('⊘ Payment cancelled:', {
        order_id,
        payment_id,
      });

      // In production, you would:
      // - Update order status to 'cancelled'
      // - Send cancellation notification to customer
    } else if (paymentStatus === 'pending') {
      console.log('⏳ Payment pending:', {
        order_id,
        payment_id,
      });

      // Pending payments are rare in PayHere, but handle gracefully
    }

    // ========================================
    // 9. RESPOND TO PAYHERE
    // ========================================

    // PayHere expects:
    // - Status 200 with any response body to confirm receipt
    // - If we don't return 200, PayHere will retry the notification

    return new Response(
      JSON.stringify({
        status: 'ok',
        order_id,
        payment_id,
        message: 'Notification received and processed',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Disable caching for webhooks
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err) {
    console.error('PayHere notification error:', err);

    // Return 500 to tell PayHere to retry
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
