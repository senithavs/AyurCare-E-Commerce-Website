/**
 * Single Product API
 * GET /api/products/[id] - Get a single product by ID or product_id
 */

import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Product ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let product;

    // Try to find by MongoDB ID first
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }

    // If not found, try to find by product_id
    if (!product) {
      product = await Product.findOne({ product_id: id }).lean();
    }

    if (!product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        product,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get product error:', error?.message || error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch product',
        message: error?.message || 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
