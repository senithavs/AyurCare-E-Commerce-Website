/**
 * Update Order Progress API
 * PATCH /api/orders/progress
 * 
 * Updates order status and tracks progress timeline
 */

import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';

const STATUS_DESCRIPTIONS = {
  pending: 'Order received and awaiting payment',
  paid: 'Payment received, order processing',
  processing: 'Order being prepared for shipment',
  shipped: 'Order has been shipped',
  delivered: 'Order has been delivered',
  cancelled: 'Order has been cancelled',
  failed: 'Order payment failed',
};

export async function PATCH(request) {
  try {
    await dbConnect();

    const { orderId, status, notes, trackingNumber, carrier, estimatedDelivery } = await request.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!status) {
      return new Response(
        JSON.stringify({ error: 'Status is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find the order
    const order = await Order.findOne({ orderId });

    if (!order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update order status
    order.status = status;

    // Add to progress timeline
    order.progressTimeline.push({
      status,
      description: STATUS_DESCRIPTIONS[status] || `Order status changed to ${status}`,
      timestamp: new Date(),
      notes: notes || undefined,
    });

    // Update timestamps based on status
    const now = new Date();
    switch (status) {
      case 'paid':
        order.paidAt = now;
        break;
      case 'processing':
        order.processingAt = now;
        break;
      case 'shipped':
        order.shippedAt = now;
        if (trackingNumber || carrier) {
          if (!order.shipping) {
            order.shipping = {};
          }
          if (trackingNumber) order.shipping.trackingNumber = trackingNumber;
          if (carrier) order.shipping.carrier = carrier;
          if (estimatedDelivery) order.shipping.estimatedDelivery = new Date(estimatedDelivery);
        }
        break;
      case 'delivered':
        order.deliveredAt = now;
        if (order.shipping) {
          order.shipping.actualDelivery = now;
        }
        break;
      case 'cancelled':
        order.cancelledAt = now;
        break;
      case 'failed':
        order.failedAt = now;
        break;
    }

    // Save updated order
    await order.save();

    console.log('Order progress updated:', {
      orderId,
      status,
      timestamp: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        order,
        message: `Order status updated to ${status}`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update order progress error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update order progress' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
