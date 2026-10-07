/**
 * Create Product API
 * POST /api/products/create - Create a new product
 */

import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      product_id,
      name,
      name_en,
      category,
      price,
      availability,
      product_benefits,
      stock_quantity,
      inStock,
    } = body;

    // Validate required fields
    if (!product_id || !name || !category || !price) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: product_id, name, category, price',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if product_id already exists
    const existingProduct = await Product.findOne({ product_id });
    if (existingProduct) {
      return new Response(
        JSON.stringify({
          error: 'Product with this ID already exists',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new product
    const newProduct = await Product.create({
      product_id,
      name,
      name_en: name || '',
      category,
      price,
      availability: availability || 'In Stock',
      product_benefits: product_benefits || [],
      stock_quantity: stock_quantity || 0,
      inStock: inStock !== undefined ? inStock : true,
      rating: 4.5,
      reviewCount: 0,
    });

    return new Response(
      JSON.stringify({
        success: true,
        product: newProduct.toObject(),
        message: 'Product created successfully',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Create product error:', error?.message || error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create product',
        message: error?.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
