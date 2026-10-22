/**
 * Products API
 * GET /api/products - Get all products with optional filters
 */

import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const availability = searchParams.get('availability');
    const limit = parseInt(searchParams.get('limit')) || 0;
    const skip = parseInt(searchParams.get('skip')) || 0;

    // Build filter object
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (availability) {
      filter.availability = availability;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { name_en: { $regex: search, $options: 'i' } },
        { product_id: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch products with filter
    let query = Product.find(filter);

    if (skip > 0) {
      query = query.skip(skip);
    }

    if (limit > 0) {
      query = query.limit(limit);
    }

    const products = await query.sort({ createdAt: -1 }).lean();
    const total = await Product.countDocuments(filter);

    return new Response(
      JSON.stringify({
        success: true,
        products: products || [],
        total,
        count: products?.length || 0,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get products error:', error?.message || error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch products',
        message: error?.message || 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
