/**
 * User Orders API
 * GET /api/orders/user - Get orders for the authenticated user
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
        JSON.stringify({
          success: false,
          error: 'User ID not provided',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('📦 Fetching orders for user:', userId);

    // Fetch orders for this user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

    console.log(`Found ${orders.length} orders for user ${userId}`);

    return new Response(
      JSON.stringify({
        success: true,
        orders: orders || [],
        count: orders?.length || 0,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get user orders error:', error?.message || error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch user orders',
        message: error?.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
