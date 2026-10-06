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
    await dbConnect();

    const { orderId } = params;

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const order = await Order.findOne({ orderId }).populate('userId', 'username email name');

    if (!order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
    console.error('Error fetching order:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch order' }),
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

    const { orderId } = params;
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
