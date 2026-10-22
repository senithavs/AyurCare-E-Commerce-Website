/**
 * Admin Orders Management API
 * GET /api/admin/orders - Get all orders
 * PATCH /api/admin/orders - Update order details
 */

import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';

/**
 * GET /api/admin/orders
 * Get all orders (admin only)
 */
export async function GET(request) {
  try {
    await dbConnect();

    // TODO: Add admin role verification
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const sort = searchParams.get('sort') || '-createdAt';
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // Get total count
    const total = await Order.countDocuments(filter);

    // Fetch orders
    const orders = await Order.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate('userId', 'username email name')
      .lean();

    // Calculate statistics
    const stats = {
      totalOrders: total,
      pendingOrders: await Order.countDocuments({ status: 'pending' }),
      paidOrders: await Order.countDocuments({ status: 'paid' }),
      shippedOrders: await Order.countDocuments({ status: 'shipped' }),
      deliveredOrders: await Order.countDocuments({ status: 'delivered' }),
      cancelledOrders: await Order.countDocuments({ status: 'cancelled' }),
      totalRevenue: await Order.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    };

    return new Response(
      JSON.stringify({
        success: true,
        orders,
        stats,
        pagination: {
          total,
          limit,
          skip,
          pages: Math.ceil(total / limit),
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get admin orders error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch orders' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * PATCH /api/admin/orders
 * Update order details (admin only)
 */
export async function PATCH(request) {
  try {
    await dbConnect();

    // TODO: Add admin role verification
    const { orderId, updates } = await request.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find order
    const order = await Order.findOne({ orderId });

    if (!order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Allowed fields to update
    const allowedFields = ['notes', 'status', 'shipping'];

    // Update fields
    for (const field of allowedFields) {
      if (field in updates) {
        if (field === 'shipping') {
          order.shipping = { ...order.shipping, ...updates.shipping };
        } else {
          order[field] = updates[field];
        }
      }
    }

    // If status is being updated, add to timeline
    if (updates.status && updates.status !== order.status) {
      order.progressTimeline.push({
        status: updates.status,
        description: `Order status updated by admin to ${updates.status}`,
        timestamp: new Date(),
        notes: `Admin update - ${updates.notes || ''}`,
      });
    }

    await order.save();

    console.log('Order updated by admin:', orderId);

    return new Response(
      JSON.stringify({
        success: true,
        order,
        message: 'Order updated successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update admin order error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
