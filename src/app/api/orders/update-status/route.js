/**
 * Update Order Status API
 * PUT /api/orders/update-status - Update an order's status
 */

import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { ObjectId } from 'mongodb';

export async function PUT(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return new Response(
        JSON.stringify({
          error: 'orderId and status are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid status. Must be: pending, processing, shipped, or delivered',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find and update order
    let order;
    try {
      if (ObjectId.isValid(orderId)) {
        order = await Order.findByIdAndUpdate(
          orderId,
          { status },
          { new: true, runValidators: true }
        ).lean();
      }
    } catch (err) {
      // Not a valid ObjectId
    }

    // If not found by _id, try by orderId string
    if (!order) {
      order = await Order.findOneAndUpdate(
        { orderId },
        { status },
        { new: true, runValidators: true }
      ).lean();
    }

    if (!order) {
      return new Response(
        JSON.stringify({
          error: 'Order not found',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        order,
        message: 'Order status updated successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update order status error:', error?.message || error);
    return new Response(
      JSON.stringify({
        error: 'Failed to update order status',
        message: error?.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
