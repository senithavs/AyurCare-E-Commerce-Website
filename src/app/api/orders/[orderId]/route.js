/**
 * Orders API Endpoint
 * 
 * GET /api/orders/[orderId] - Get order by orderId with progress
 * PATCH /api/orders/[orderId] - Update order status
 */

import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';

/**
 * GET /api/orders/[orderId]
 * Retrieve order details by orderId with progress tracking
 */
export async function GET(request, { params }) {
  try {
    console.log('📥 GET /api/orders/[orderId] called');
    
    // In Next.js 16+, params is a Promise and must be awaited
    const { orderId } = await params;
    console.log('Extracted orderId:', orderId, 'Type:', typeof orderId);
    
    await dbConnect();

    if (!orderId || orderId.trim() === '') {
      console.error('❌ orderId is missing or empty');
      return new Response(
        JSON.stringify({ 
          error: 'Order ID is required',
          received: orderId,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const trimmedOrderId = orderId.trim();
    console.log('Searching for order with orderId:', trimmedOrderId);
    
    const order = await Order.findOne({ orderId: trimmedOrderId }).lean();
    console.log('Database query result:', order ? 'Found' : 'Not found');

    if (!order) {
      console.error('❌ Order not found in database for orderId:', trimmedOrderId);
      // List all orders for debugging
      const allOrders = await Order.find().select('orderId').limit(5).lean();
      console.log('Sample orders in DB:', allOrders);
      
      return new Response(
        JSON.stringify({ 
          error: 'Order not found',
          searchedFor: trimmedOrderId,
          hint: 'Try refreshing the page or checking the order ID',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Order found:', trimmedOrderId);

    // Calculate order progress percentage
    const statusProgression = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
    const currentProgress = statusProgression.indexOf(order.status);
    const progressPercentage = currentProgress >= 0 ? (currentProgress / (statusProgression.length - 1)) * 100 : 0;

    return new Response(
      JSON.stringify({
        success: true,
        order,
        progressPercentage: Math.round(progressPercentage),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('❌ Error in GET /api/orders:', err);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch order',
        message: err.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * PATCH /api/orders/[orderId]
 * Update order status and other fields
 */
export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    // In Next.js 16+, params is a Promise and must be awaited
    const { orderId } = await params;
    const updates = await request.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find and update the order
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      {
        ...updates,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order updated:', orderId, updates);

    return new Response(JSON.stringify({
      success: true,
      order: updatedOrder,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error updating order:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to update order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
