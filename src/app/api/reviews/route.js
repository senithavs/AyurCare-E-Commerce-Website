/**
 * Reviews API
 * GET /api/reviews?product_id=xxx - Get all approved reviews for a product
 */

import dbConnect from '@/lib/mongodb';
import Review from '@/lib/models/Review';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = parseInt(searchParams.get('skip')) || 0;

    if (!product_id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'product_id is required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch approved reviews only
    const reviews = await Review.find({
      product_id,
      status: 'approved',
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments({
      product_id,
      status: 'approved',
    });

    return new Response(
      JSON.stringify({
        success: true,
        reviews,
        total,
        count: reviews.length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get reviews error:', error?.message || error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch reviews',
        message: error?.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
