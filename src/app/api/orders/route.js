/**
 * Orders API
 * GET /api/orders - Get all orders (with optional filters)
 */

import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 0;
    const skip = parseInt(searchParams.get('skip')) || 0;

    // Build filter object
    const filter = {};

    if (userId) {
      filter.userId = userId;
    }

    if (status) {
      filter.status = status;
    }

    // Fetch orders with filter
    let query = Order.find(filter);

    if (skip > 0) {
      query = query.skip(skip);
    }

    if (limit > 0) {
      query = query.limit(limit);
    }

    const orders = await query.sort({ date: -1 }).lean();
    const total = await Order.countDocuments(filter);

    return new Response(
      JSON.stringify({
        success: true,
        orders: orders || [],
        total,
        count: orders?.length || 0,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get orders error:', error?.message || error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch orders',
        message: error?.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
