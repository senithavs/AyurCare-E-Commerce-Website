/**
 * Delete Product API
 * DELETE /api/products/delete - Delete a product
 */

import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { ObjectId } from 'mongodb';

export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({
          error: 'Product ID is required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let product;

    // Try to find by MongoDB _id first
    try {
      if (ObjectId.isValid(id)) {
        product = await Product.findByIdAndDelete(id).lean();
      }
    } catch (err) {
      // Not a valid ObjectId, continue to next search
    }

    // If not found by _id, try product_id
    if (!product) {
      product = await Product.findOneAndDelete({ product_id: id }).lean();
    }

    if (!product) {
      return new Response(
        JSON.stringify({
          error: 'Product not found',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Product deleted successfully',
        product,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Delete product error:', error?.message || error);
    return new Response(
      JSON.stringify({
        error: 'Failed to delete product',
        message: error?.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
