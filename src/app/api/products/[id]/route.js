/**
 * Single Product API
 * GET /api/products/[id] - Get a single product by ID, product_id, or MongoDB _id
 */

import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Product ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Try to find by MongoDB _id first (if valid ObjectId)
    let product = null;

    try {
      if (ObjectId.isValid(id)) {
        product = await Product.findById(id).lean();
      }
    } catch (err) {
      // Not a valid ObjectId, continue to other searches
    }

    // If not found, try to find by product_id
    if (!product) {
      product = await Product.findOne({ product_id: id }).lean();
    }

    // If still not found, try to find by name (loose match)
    if (!product) {
      product = await Product.findOne({
        name: { $regex: id, $options: 'i' }
      }).lean();
    }

    if (!product) {
      return new Response(
        JSON.stringify({ 
          error: 'Product not found',
          searchedId: id 
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        product: product,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get single product error:', error?.message || error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch product',
        message: error?.message || 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
