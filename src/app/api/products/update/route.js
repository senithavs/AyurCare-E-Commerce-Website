/**
 * Update Product API
 * PUT /api/products/update - Update an existing product
 */

import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { ObjectId } from 'mongodb';

export async function PUT(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id, product_id, name, name_en, category, price, availability, product_benefits, stock_quantity, inStock } = body;

    if (!id) {
      return new Response(
        JSON.stringify({
          error: 'Product ID is required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build update object with only provided fields
    const updateData = {};
    if (product_id !== undefined) updateData.product_id = product_id;
    if (name !== undefined) updateData.name = name;
    if (name_en !== undefined) updateData.name_en = name_en;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (availability !== undefined) updateData.availability = availability;
    if (product_benefits !== undefined) updateData.product_benefits = product_benefits;
    if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity;
    if (inStock !== undefined) updateData.inStock = inStock;

    // Find and update product
    let product;
    try {
      if (ObjectId.isValid(id)) {
        product = await Product.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }).lean();
      }
    } catch (err) {
      // Not a valid ObjectId, try product_id
    }

    // If not found by _id, try product_id
    if (!product) {
      product = await Product.findOneAndUpdate(
        { product_id: id },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).lean();
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
        product,
        message: 'Product updated successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update product error:', error?.message || error);
    return new Response(
      JSON.stringify({
        error: 'Failed to update product',
        message: error?.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
