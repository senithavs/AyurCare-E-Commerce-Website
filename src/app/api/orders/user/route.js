/**
 * Get User Orders API
 * GET /api/orders/user
 * 
 * Retrieves all orders for a specific user
 */

import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function GET(request) {
  try {
    await dbConnect();

    // Get userId from header
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get query parameters for filtering and sorting
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || '-createdAt'; // default: newest first
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Build filter
    const filter = { userId };
    if (status) {
      filter.status = status;
    }

    // Get total count
    const total = await Order.countDocuments(filter);

    // Fetch orders with pagination
    const orders = await Order.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean();

    return new Response(
      JSON.stringify({
        success: true,
        orders,
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
    console.error('Get user orders error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch orders' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
